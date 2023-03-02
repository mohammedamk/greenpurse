package com.mygreenwallet2;

import com.facebook.react.ReactActivity;
import android.content.Intent;
import android.os.Build;
import android.content.pm.PackageManager;

import android.os.Bundle;
import android.net.Uri;

import android.provider.Settings;

public class MainActivity extends ReactActivity {

    public static final int PERMISSION_REQ_CODE = 1234;
    public static final int OVERLAY_PERMISSION_REQ_CODE = 1235;

    String[] perms = {
        "android.permission.READ_EXTERNAL_STORAGE", 
        "android.permission.WRITE_EXTERNAL_STORAGE"
    };

	@Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onCreate (Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Checking permissions on init
        checkPerms();
    }

    public void checkPerms() {
        // Checking if device version > 22 and we need to use new permission model 
        if(Build.VERSION.SDK_INT>Build.VERSION_CODES.LOLLIPOP_MR1) {
            // Checking if we can draw window overlay
            if (!Settings.canDrawOverlays(this)) {
                // Requesting permission for window overlay(needed for all react-native apps)
                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                  Uri.parse("package:" + getPackageName()));
                startActivityForResult(intent, OVERLAY_PERMISSION_REQ_CODE);
            }
            for(String perm : perms){
                // Checking each persmission and if denied then requesting permissions
                if(checkSelfPermission(perm) == PackageManager.PERMISSION_DENIED){
                    requestPermissions(perms, PERMISSION_REQ_CODE);
                    break;
                }
            }
        }
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "myGreenWallet2";
    }
}
