# Ökoplan — iPhone app (TestFlight)

A Capacitor shell around the live office system (https://oekoplan-landscaping.github.io/app/), built on Codemagic by
`../codemagic.yaml` and uploaded to TestFlight. Web changes reach the app at once (it opens the live address) — only a change in
this folder (icons, permissions, native settings) needs a new build, and a push touching `ios-app/` or `codemagic.yaml` starts it.

- Bundle id `com.oekoplan.office` (same as the Android app) · Apple team `UF4QLJ9AY9` · iPhone only, portrait.
- Push: APNs with the team key already on the office server (`admin_config.apns_cfg`, topic `com.oekoplan.office`).
- Nothing secret here: signing comes from Codemagic (App Store Connect integration «ninety-ci» + the «Ökoplan AppStore» profile).
- The Android Play bundle is built separately (same id, same Ökoplan signing key) and kept in `../store/Oekoplan.aab`.
