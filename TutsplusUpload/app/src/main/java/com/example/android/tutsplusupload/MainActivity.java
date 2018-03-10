package com.example.android.tutsplusupload;

import android.app.ProgressDialog;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.provider.MediaStore;
import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.OnProgressListener;
import com.google.firebase.storage.StorageReference;
import com.google.firebase.storage.UploadTask;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.UUID;

public class MainActivity extends AppCompatActivity {

    private Button btnChoose, btnUpload;
    private ImageView imageView;

    private Uri filePath;
    TextView content;
    private final int PICK_IMAGE_REQUEST = 71;

    //Firebase
    FirebaseStorage storage;
    StorageReference storageReference;

    private void chooseImage() {
        Intent intent = new Intent();
        intent.setType("image/*");
        intent.setAction(Intent.ACTION_GET_CONTENT);
        startActivityForResult(Intent.createChooser(intent, "Select Picture"), PICK_IMAGE_REQUEST);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == PICK_IMAGE_REQUEST && resultCode == RESULT_OK
                && data != null && data.getData() != null) {
            filePath = data.getData();
            try {
                Bitmap bitmap = MediaStore.Images.Media.getBitmap(getContentResolver(), filePath);
                imageView.setImageBitmap(bitmap);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private void analyzeImage(String fileName){
        try {
            PostTask postTask = new PostTask();
            String data = "{\n" +
                    "  \"requests\":[\n" +
                    "    {\n" +
                    "     \"image\":{\n" +
                    "        \"source\":{\n" +
                    "          \"imageUri\":\n" +
                    "            \"gs://centering-dock-194606.appspot.com/images/"+fileName+"\"\n" +
                    "        }\n" +
                    "      },\n" +
                    "      \"features\":[\n" +
                    "        {\n" +
                    "          \"type\":\"LABEL_DETECTION\",\n" +
                    "          \"maxResults\":100\n" +
                    "        }\n" +
                    "      ]\n" +
                    "    }\n" +
                    "  ]\n" +
                    "}";
            String url = "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyC7ZsHWEpjUK45YuZYQP431EHrmhhnhNno";
            String body = data;


            postTask.execute(url, body);


        } catch (Exception ex) {
            content.setText(" url exeption! ");
        }
    }

    private void uploadImage() {

        if (filePath != null) {
            final ProgressDialog progressDialog = new ProgressDialog(this);
            progressDialog.setTitle("Uploading...");
            progressDialog.show();
            final String name = UUID.randomUUID().toString();
            StorageReference ref = storageReference.child("images/" + name);
            ref.putFile(filePath)
                    .addOnSuccessListener(new OnSuccessListener<UploadTask.TaskSnapshot>() {
                        @Override
                        public void onSuccess(UploadTask.TaskSnapshot taskSnapshot) {
                            progressDialog.dismiss();
                            Toast.makeText(MainActivity.this, "Uploaded", Toast.LENGTH_SHORT).show();
                            analyzeImage(name);
                        }
                    })
                    .addOnFailureListener(new OnFailureListener() {
                        @Override
                        public void onFailure(@NonNull Exception e) {
                            progressDialog.dismiss();
                            Toast.makeText(MainActivity.this, "Failed " + e.getMessage(), Toast.LENGTH_SHORT).show();
                        }
                    })
                    .addOnProgressListener(new OnProgressListener<UploadTask.TaskSnapshot>() {
                        @Override
                        public void onProgress(UploadTask.TaskSnapshot taskSnapshot) {
                            double progress = (100.0 * taskSnapshot.getBytesTransferred() / taskSnapshot
                                    .getTotalByteCount());
                            progressDialog.setMessage("Uploaded " + (int) progress + "%");
                        }
                    });
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //Initialize Views
        btnChoose = (Button) findViewById(R.id.btnChoose);
        btnUpload = (Button) findViewById(R.id.btnUpload);
        imageView = (ImageView) findViewById(R.id.imgView);

        //FireBase initial
        storage = FirebaseStorage.getInstance();
        storageReference = storage.getReference();


        btnChoose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                chooseImage();
            }
        });

        btnUpload.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                uploadImage();
            }
        });

        content = (TextView) findViewById(R.id.content);

    }

    class PostTask extends AsyncTask<String, Void, String> {
        @Override
        protected String doInBackground(String... params) {

            try {
                URL url = new URL(params[0]);
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();

                connection.setRequestMethod("POST");
                connection.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
                connection.setRequestProperty("Accept", "*/*");

                connection.setDoOutput(true);
                BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(connection.getOutputStream()));
                writer.write(params[1]);
                writer.close();

                connection.connect();

                // Response: 400

                InputStream is = connection.getInputStream();
                final int PKG_SIZE = 1024;
                byte[] data = new byte [PKG_SIZE];
                StringBuilder buffer = new StringBuilder(PKG_SIZE * 10);
                int size;
                size = is.read(data, 0, data.length);
                while (size > 0)
                {
                    String str = new String(data, 0, size);
                    buffer.append(str);
                    size = is.read(data, 0, data.length);
                }
                String test = buffer.toString();

                Log.e("Response", test + "");
                return test;

            } catch (Exception e) {
                Log.e(e.toString(), "Something with request");
            }

            return null;
        }
        protected void onPostExecute(String result) {
            // NO NEED to use activity.runOnUiThread(), code execute here under UI thread.

            // Updating parsed JSON data into ListView
           // final List data = new Gson().fromJson(result);
            // updating listview
            //((ListActivity) activity).updateUI(data);
            content.setText(result);
        }
    }

}

