package com.example.android.tutsplusupload;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.widget.ImageView;
import android.widget.TextView;

public class AnalyzeActivity extends AppCompatActivity {
    private ImageView imageView;
    private TextView result;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_analyze);

        //Initialize Views
        imageView = (ImageView) findViewById(R.id.imgView);
        result = (TextView) findViewById(R.id.result);

        //Bitmap bitmap = (Bitmap) getIntent().getParcelableExtra("BitmapImage");

        //imageView.setImageBitmap(bitmap);
        result.setText(getIntent().getStringExtra("RESULT"));
    }
}

