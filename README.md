# 'Firebase Functions'-on-'Cloud Run'-wrapper
Steps to convert your project to Cloud Run:
1. Copy files to your repository:
	- cloudrun (directory)
	- Dockerfile
	- .dockerignore
	- the instructions below (README.md -> CLOUD_RUN.md)
2. Install 2 modules (`npm i require-injector typescript`) in your "functions" directory.
3. Adjust & run 'usage' commands below

## Usage
```bash
# Upload versions
docker build -t gcr.io/my-project/functions .
docker push eu.gcr.io/my-project/functions

# Deploy version v1
gcloud beta run deploy my-project --revision-suffix=v1 --tag=stable \
	--project=my-project --region=europe-west4 --platform=managed \
	--image=eu.gcr.io/my-project/functions

# Deploy version v2 (same container in this example)
gcloud beta run deploy my-project --revision-suffix=v2 --tag=latest \
	--project=my-project --region=europe-west4 --platform=managed \
	--image=eu.gcr.io/my-project/functions
```

## Why?
Cloud Run has a few benefits over Firebase Functions:
- it integrates much better with other GCP services
- it can run ANY language, as long as you can put it in a Docker image
- multiple versions can be active at the same time and have their own url
- it is easy to see which version is live
- it is easy to revert to an old version

Cloud Run has a few downsides over Firebase Functions:
- no Firestore document events (can be shimmed via Firestore Snapshot listeners)
- no auth.user().onCreate events (use the real Firebase Function for this)
- no config() support (but shimmed via process.env)
