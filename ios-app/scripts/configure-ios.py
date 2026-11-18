# Ökoplan iOS — applies the app settings to the freshly generated Capacitor iOS project (run after `npx cap add ios`).
# iPhone only, portrait; push notifications (APNs, same team key as the office server's «push» function, topic com.oekoplan.office).
import plistlib
INFO = 'ios/App/App/Info.plist'; PBX = 'ios/App/App.xcodeproj/project.pbxproj'; DELEGATE = 'ios/App/App/AppDelegate.swift'
TEAM = 'UF4QLJ9AY9'; BUNDLE = 'com.oekoplan.office'
d = plistlib.load(open(INFO, 'rb'))
d.update({
    'CFBundleDisplayName': 'Ökoplan',
    'CFBundleDevelopmentRegion': 'en', 'CFBundleLocalizations': ['en', 'ar'],
    'NSCameraUsageDescription': 'Ökoplan uses the camera to scan the office QR code when you punch in, to take project and site photos, and for video in meetings.',
    'NSPhotoLibraryUsageDescription': 'Ökoplan lets you attach photos from your library to tasks, projects and requests.',
    'NSPhotoLibraryAddUsageDescription': 'Ökoplan saves files you export (reports, PDFs, drawings) to your photo library.',
    'NSMicrophoneUsageDescription': 'Ökoplan uses the microphone for team calls, meetings and voice notes.',
    'NSLocationWhenInUseUsageDescription': 'Ökoplan notes where a punch was made when you punch in or out from a project site.',
    'ITSAppUsesNonExemptEncryption': False,
    'UIBackgroundModes': ['remote-notification'],
    'UIRequiredDeviceCapabilities': ['arm64'],
    'UISupportedInterfaceOrientations': ['UIInterfaceOrientationPortrait'],
    'UIStatusBarStyle': 'UIStatusBarStyleDefault',
})
plistlib.dump(d, open(INFO, 'wb'))
open('ios/App/App/App.entitlements', 'w').write('''<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>aps-environment</key>
	<string>production</string>
</dict>
</plist>
''')
s = open(PBX).read()
s = s.replace('TARGETED_DEVICE_FAMILY = "1,2";', 'TARGETED_DEVICE_FAMILY = 1;')
s = s.replace('MARKETING_VERSION = 1.0;', 'MARKETING_VERSION = 1.0.0;')
if 'CODE_SIGN_ENTITLEMENTS' not in s:
    s = s.replace('PRODUCT_BUNDLE_IDENTIFIER = %s;' % BUNDLE, 'PRODUCT_BUNDLE_IDENTIFIER = %s;\n\t\t\t\tCODE_SIGN_ENTITLEMENTS = App/App.entitlements;\n\t\t\t\tDEVELOPMENT_TEAM = %s;' % (BUNDLE, TEAM))
if 'CODE_SIGN_ENTITLEMENTS' not in s:
    raise SystemExit('pbxproj: bundle id %s not found' % BUNDLE)
open(PBX, 'w').write(s)
a = open(DELEGATE).read()
if 'capacitorDidRegisterForRemoteNotifications' not in a:
    a = a.rstrip().rstrip('}') + '''
    // push: hand the APNs token to the Capacitor push plugin (the office system registers it with its «push» function)
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        NotificationCenter.default.post(name: .capacitorDidRegisterForRemoteNotifications, object: deviceToken)
    }

    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        NotificationCenter.default.post(name: .capacitorDidFailToRegisterForRemoteNotifications, object: error)
    }
}
'''
    open(DELEGATE, 'w').write(a)
print('ios configured: Ökoplan', BUNDLE)
