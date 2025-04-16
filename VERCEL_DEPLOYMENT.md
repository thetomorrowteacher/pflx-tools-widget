# Deploying to Vercel

There are two methods to deploy your app to Vercel:

## Method 1: Manual Deployment (Recommended)

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Click on "Add New" → "Project"
3. Choose "Import Project" → "Upload"
4. Upload the `pflx-deploy.zip` file from your Desktop
5. Set Project Name: `pflx-class-tools`
6. Click "Deploy"

Your app will be deployed to https://pflx-class-tools.vercel.app/

## Method 2: GitHub Deployment

1. Create a GitHub repository if you haven't already
2. Push your code to GitHub
3. Go to your Vercel dashboard
4. Click on "Add New" → "Project"
5. Import your GitHub repository
6. Configure:
   - Framework Preset: "Create React App"
   - Root Directory: "/"
   - Build Command: "npm run build"
   - Output Directory: "build"
7. Click "Deploy"

## Testing Your Deployment

Once deployed, visit https://pflx-class-tools.vercel.app/ to confirm everything works.

## Embed Code

```html
<!-- PFLX Class Tools Widget (16:6 Aspect Ratio) -->
<style>
  .pflx-embed-container {
    position: relative;
    width: 100%;
    padding-bottom: 37.5%; /* 6/16 = 0.375 or 37.5% */
    height: 0;
    overflow: hidden;
    border-radius: 8px;
    margin: 20px 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .pflx-embed-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
</style>

<div class="pflx-embed-container">
  <iframe 
    src="https://pflx-class-tools.vercel.app/?embed=true" 
    frameborder="0" 
    allowfullscreen>
  </iframe>
</div>
```