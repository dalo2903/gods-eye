package com.example.android.tutsplusupload;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.widget.ImageView;
import android.widget.TextView;

import org.json.JSONArray;

public class AnalyzeActivity extends AppCompatActivity {
    private ImageView imageView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_analyze);

        //Initialize Views
        imageView = (ImageView) findViewById(R.id.imgView);
        TextView result_0 = (TextView) findViewById(R.id.result_0);
        TextView result_1 = (TextView) findViewById(R.id.result_1);
        TextView result_2 = (TextView) findViewById(R.id.result_2);

        //Bitmap bitmap = (Bitmap) getIntent().getParcelableExtra("BitmapImage");
        String str = getIntent().getStringExtra("RESULT");
        JSONArray minifiedLabels = new JSONArray();

        try {
            minifiedLabels = new JSONArray(str);
            String res0 = minifiedLabels.getJSONObject(0).getString("description");
            result_0.setText(res0);
            String res1 = minifiedLabels.getJSONObject(1).getString("description");
            result_1.setText(res1);
            String res2 = minifiedLabels.getJSONObject(2).getString("description");
            result_2.setText(res2);
            // result_0.setText(res1);
        } catch (Exception e) {
            // doesn't throw another exception
            // return new JSONObject(new HashMap());
        }

        // result_0.setText();

        //imageView.setImageBitmap(bitmap);
    }
}

