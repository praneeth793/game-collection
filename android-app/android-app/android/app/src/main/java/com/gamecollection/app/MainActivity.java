package com.gamecollection.app;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.gamecollection.app.databinding.ActivityMainBinding;

public class MainActivity extends AppCompatActivity {
    
    private ActivityMainBinding binding;
    private WebView webView;
    private FrameLayout touchControlsOverlay;
    private boolean exitPressedOnce = false;
    private static final String INITIAL_URL = "file:///android_asset/index.html";
    
    // Touch control tracking
    private float touchStartX = 0;
    private float touchStartY = 0;
    private static final float SWIPE_THRESHOLD = 100;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Enable edge-to-edge display
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        
        // Keep screen on while playing
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        
        setupWindowInsets();
        setupWebView();
        setupTouchControls();
        loadWebContent();
    }
    
    private void setupWindowInsets() {
        ViewCompat.setOnApplyWindowInsetsListener(binding.getRoot(), (v, windowInsets) -> {
            var insets = windowInsets.getInsets(WindowInsetsCompat.Type.systemBars());
            binding.webView.setPadding(insets.left, insets.top, insets.right, insets.bottom);
            binding.touchControlsOverlay.setPadding(insets.left, insets.top, insets.right, insets.bottom);
            return WindowInsetsCompat.CONSUMED;
        });
    }
    
    @SuppressLint("SetJavaScriptEnabled")
    private void setupWebView() {
        webView = binding.webView;
        
        // WebView settings
        WebSettings settings = webView.getSettings();
        
        // Enable JavaScript
        settings.setJavaScriptEnabled(true);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        
        // Enable DOM storage
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        
        // Enable caching
        settings.setAppCacheEnabled(true);
        settings.setAppCachePath(getCacheDir().getAbsolutePath());
        
        // Enable mixed content (for external resources)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
            CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);
        }
        
        // Enable hardware acceleration
        settings.setHardwareAccelerationEnabled(true);
        settings.setPluginState(WebSettings.PluginState.ON);
        
        // Enable responsive layout
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        
        // Disable zooming issues
        settings.setBuiltInZoomControls(false);
        settings.setSupportZoom(false);
        settings.setDisplayZoomControls(false);
        
        // Enable file access from web
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        
        // User agent for mobile
        settings.setUserAgentString(settings.getUserAgentString() + 
            " AndroidMobileApp/1.0 (GameCollection/1.0)");
        
        // WebChromeClient for console messages and fullscreen
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onConsoleMessage(String message, int lineNumber, String sourceID) {
                android.util.Log.d("WebView", message + " -- From line " + 
                    lineNumber + " of " + sourceID);
            }
            
            @Override
            public void onShowCustomView(View view, CustomViewCallback callback) {
                super.onShowCustomView(view, callback);
                // Handle fullscreen video if needed
            }
        });
        
        // WebViewClient for handling navigation
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // Handle external links
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    // External link - open in browser
                    if (!url.contains("file:///android_asset")) {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                        return true;
                    }
                } else if (url.startsWith("gamecollection://")) {
                    // Handle deep links
                    return true;
                }
                return false;
            }
            
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                // Inject touch control JavaScript
                injectTouchControls();
            }
        });
    }
    
    private void setupTouchControls() {
        touchControlsOverlay = binding.touchControlsOverlay;
        
        // Enable touch events on the overlay
        touchControlsOverlay.setClickable(true);
        touchControlsOverlay.setFocusable(true);
        
        touchControlsOverlay.setOnTouchListener((v, event) -> {
            handleTouchEvent(event);
            return true;
        });
    }
    
    private void handleTouchEvent(android.view.MotionEvent event) {
        switch (event.getAction()) {
            case android.view.MotionEvent.ACTION_DOWN:
                touchStartX = event.getX();
                touchStartY = event.getY();
                break;
                
            case android.view.MotionEvent.ACTION_UP:
                float touchEndX = event.getX();
                float touchEndY = event.getY();
                
                float diffX = touchEndX - touchStartX;
                float diffY = touchEndY - touchStartY;
                
                // Detect swipe gestures
                if (Math.abs(diffX) > SWIPE_THRESHOLD || Math.abs(diffY) > SWIPE_THRESHOLD) {
                    handleSwipe(diffX, diffY);
                } else {
                    // Tap gesture - inject tap event into WebView
                    injectTapEvent(event.getX(), event.getY());
                }
                break;
        }
    }
    
    private void handleSwipe(float diffX, float diffY) {
        // Handle navigation swipes
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            if (diffX > 0) {
                // Swipe right - go back
                if (webView.canGoBack()) {
                    webView.goBack();
                }
            } else {
                // Swipe left - forward
                if (webView.canGoForward()) {
                    webView.goForward();
                }
            }
        } else {
            // Vertical swipe
            if (diffY > 0) {
                // Swipe down - refresh
                webView.reload();
            }
        }
    }
    
    private void injectTapEvent(float x, float y) {
        // Convert coordinates to percentage
        float xPercent = (x / touchControlsOverlay.getWidth()) * 100;
        float yPercent = (y / touchControlsOverlay.getHeight()) * 100;
        
        // Inject JavaScript to simulate tap
        String jsScript = String.format(
            "window.dispatchEvent(new CustomEvent('mobileTap', { detail: { x: %.2f, y: %.2f } }));",
            xPercent, yPercent
        );
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            webView.evaluateJavascript(jsScript, null);
        } else {
            webView.loadUrl("javascript:" + jsScript);
        }
    }
    
    private void injectSwipeEvent(float diffX, float diffY) {
        String direction = "";
        if (Math.abs(diffX) > Math.abs(diffY)) {
            direction = diffX > 0 ? "right" : "left";
        } else {
            direction = diffY > 0 ? "down" : "up";
        }
        
        String jsScript = String.format(
            "window.dispatchEvent(new CustomEvent('mobileSwipe', { detail: { direction: '%s' } }));",
            direction
        );
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            webView.evaluateJavascript(jsScript, null);
        } else {
            webView.loadUrl("javascript:" + jsScript);
        }
    }
    
    private void injectTouchControls() {
        // Inject global touch control handlers
        String touchControlScript = """
            (function() {
                // Prevent default touch behaviors on game elements
                document.addEventListener('touchstart', function(e) {
                    if (e.target.closest('canvas') || e.target.closest('.game-container')) {
                        // Allow touch on game elements
                        return;
                    }
                    // Prevent zoom/scroll on UI elements
                    if (e.touches.length > 1) {
                        e.preventDefault();
                    }
                }, { passive: false });
                
                document.addEventListener('touchmove', function(e) {
                    if (e.target.closest('canvas') || e.target.closest('.game-container')) {
                        return;
                    }
                    if (e.touches.length > 1) {
                        e.preventDefault();
                    }
                }, { passive: false });
                
                // Handle tap events from native code
                window.addEventListener('mobileTap', function(e) {
                    console.log('Mobile tap at:', e.detail.x, e.detail.y);
                });
                
                // Handle swipe events from native code
                window.addEventListener('mobileSwipe', function(e) {
                    console.log('Mobile swipe:', e.detail.direction);
                    if (e.detail.direction === 'left' && window.gameNavigation) {
                        window.gameNavigation.goForward();
                    } else if (e.detail.direction === 'right' && window.gameNavigation) {
                        window.gameNavigation.goBack();
                    }
                });
                
                // Expose game navigation to native code
                window.gameNavigation = {
                    goBack: function() {
                        if (history.length > 1) {
                            window.history.back();
                        }
                    },
                    goForward: function() {
                        window.history.forward();
                    },
                    reload: function() {
                        location.reload();
                    }
                };
                
                console.log('Touch controls initialized');
            })();
            """;
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            webView.evaluateJavascript(touchControlScript, null);
        } else {
            webView.loadUrl("javascript:" + touchControlScript);
        }
    }
    
    private void loadWebContent() {
        webView.loadUrl(INITIAL_URL);
    }
    
    @Override
    public void onBackPressed() {
        // Check if WebView can go back
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            // Double press to exit
            if (exitPressedOnce) {
                super.onBackPressed();
                finish();
                return;
            }
            
            exitPressedOnce = true;
            Toast.makeText(this, "Press back again to exit", Toast.LENGTH_SHORT).show();
            
            // Reset exit flag after 2 seconds
            new Handler(Looper.getMainLooper()).postDelayed(() -> {
                exitPressedOnce = false;
            }, 2000);
        }
    }
    
    @Override
    protected void onResume() {
        super.onResume();
        webView.onResume();
    }
    
    @Override
    protected void onPause() {
        super.onPause();
        webView.onPause();
    }
    
    @Override
    protected void onDestroy() {
        webView.destroy();
        super.onDestroy();
    }
    
    @Override
    public void onConfigurationChanged(@NonNull android.content.res.Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        // Handle orientation changes
    }
}
