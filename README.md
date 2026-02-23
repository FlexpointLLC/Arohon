# arohon.co

Minimal site for **https://arohon.co** so that shared track links open the Arohon app (Universal Links / App Links) or redirect to the app.

## Deploy on Vercel

1. Push this folder to a Git repo (or use **Import** from the `arohon-co` folder).
2. In [Vercel](https://vercel.com): **Add New Project** → Import the repo.
3. Set **Root Directory** to `arohon-co` if the repo contains multiple projects.
4. Deploy. Then add your domain **arohon.co** in Project Settings → Domains.

## Before links open the app

Replace the placeholders in this project and in the app:

### 1. Apple (Universal Links)

- Open **public/.well-known/apple-app-site-association**.
- Replace `YOUR_APPLE_TEAM_ID` with your [Apple Team ID](https://developer.apple.com/account#MembershipDetailsCard) (e.g. `ABC123XYZ`).
- In the **customer-app** Xcode project: add **Associated Domains** → `applinks:arohon.co`.

### 2. Android (App Links)

- Open **public/.well-known/assetlinks.json**.
- Replace `YOUR_ANDROID_SHA256_FINGERPRINT` with your app’s SHA-256 fingerprint (from your upload key or debug keystore):
  ```bash
  keytool -list -v -keystore your.keystore -alias youralias
  ```
- In the **customer-app** Android project: ensure an intent filter for `https://arohon.co/track` with `android:autoVerify="true"` (Expo may add this when configured).

## What this site does

- **/.well-known/apple-app-site-association** – Used by iOS to open the app for `https://arohon.co/track/*`.
- **/.well-known/assetlinks.json** – Used by Android to open the app for `https://arohon.co/track/*`.
- **/track/[id]** – Web page that redirects to `arohon-customer://track/[id]` so that if the link is opened in a browser, the user can still jump to the app.

## Local dev

```bash
cd arohon-co
npm install
npm run dev
```

Open http://localhost:3000/track/any-ride-id to test the redirect.
