package com.gamecollection.app;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.webkit.CookieManager;
import android.webkit.WebView;

import androidx.appcompat.app.AppCompatActivity;

@SuppressLint("CustomSplashScreen")
public class SplashActivity extends AppCompatActivity {
    
    private static final long SPLASH_DURATION = 2000; // 2 seconds
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Create splash screen view
        setContentView(R.layout.activity_splash);
        
        // Preload WebView in background
        preloadWebView();
        
        // Navigate to main activity after delay
        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            Intent intent = new Intent(this, MainActivity.class);
            startActivity(intent);
            finish();
            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out);
        }, SPLASH_DURATION);
    }
    
    private void preloadWebView() {
        // Create WebView but don't add to view hierarchy
        // This preloads cached resources
        new Handler(Looper.getMainLooper()).post(() -> {
            try {
                WebView webView = new WebView(this);
                WebSettings settings = webView.getSettings();
                settings.setJavaScriptEnabled(true);
                settings.setDomStorageEnabled(true);
                settings.setAppCacheEnabled(true);
                
                // Warm up cache
                CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);
                
                webView.destroy();
            } catch (Exception e) {
                // Ignore errors during preload
            }
        });
    }
    
    @Override
    protected void onDestroy() {
        super.onDestroy();
    }
}
