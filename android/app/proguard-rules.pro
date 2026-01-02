# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in the Android SDK directory.

# Keep WebView related classes
-keepclassmembers class * extends android.webkit.WebViewClient {
    public void *(android.webkit.WebView, java.lang.String);
    public void *(android.webkit.WebView, java.lang.String, android.graphics.Bitmap);
    public boolean *(android.webkit.WebView, java.lang.String);
}

# Keep custom JavaScript interfaces
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep application classes
-keep class com.gamecollection.app.** { *; }

# Capacitor
-keep class com.capacitorjs.** { *; }

# AndroidX
-keep class androidx.** { *; }
-dontwarn androidx.**

# Keep Parcelables
-keepclassmembers class * implements android.os.Parcelable {
    public static final ** CREATOR;
}

# Keep enums
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}
