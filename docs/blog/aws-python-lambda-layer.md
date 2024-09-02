---
title: Creating and Deploying Custom Lambda Layers for Python Functions
description: A step-by-step guide on creating and deploying custom AWS Lambda layers to include additional Python dependencies, featuring a bash script for building layers locally.
head:
  - - meta
    - property: 'og:description'
      content: A step-by-step guide on creating and deploying custom AWS Lambda layers to include additional Python dependencies, featuring a bash script for building layers locally.
  - - meta
    - property: 'og:title'
      content: Custom Lambda Layers for Python Functions | Nicolas Neudeck
  - - meta
    - property: 'og:image'
      content: https://lh3.googleusercontent.com/d/143dWzO4qTrRQ3O2D1xBh7h7z6Udba_a4
  - - meta
    - property: 'og:url'
      content: https://nicolasneudeck.com/blog/aws-python-lambda-layer
  - - meta
    - property: keywords
      content: 'AWS, Lambda, Layer, Python, Dependencies, Nicolas, Neudeck'
  - - meta
    - name: 'twitter:card'
      content: summary
  - - meta
    - property: 'og:type'
      content: website
  - - meta
    - name: 'twitter:title'
      content: Custom Lambda Layers for Python Functions | Nicolas Neudeck
  - - meta
    - name: 'twitter:description'
      content: A step-by-step guide on creating and deploying custom AWS Lambda layers to include additional Python dependencies, featuring a bash script for building layers locally.
  - - meta
    - name: 'twitter:image'
      content: https://lh3.googleusercontent.com/d/143dWzO4qTrRQ3O2D1xBh7h7z6Udba_a4
  - - meta
    - name: 'twitter:site'
      content: '@NeudeckNicolas'
  - - meta
    - name: 'twitter:creator'
      content: '@NeudeckNicolas'
  - - meta
    - name: 'twitter:url'
      content: https://nicolasneudeck.com/blog/aws-python-lambda-layer
  - - meta
    - name: google-site-verification
      content: 9agtSktJYcUTkHEIMiXa-0GX5OAFp-aq-M-sGdHEDm8
---
<script setup>
import Hero from '../../components/Hero.vue'
import Share from '../../components/Share.vue'
const prettyDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};
const empty_string = ""
const title = "Creating and Deploying Custom Lambda Layers for Python Functions"
const shortDescription = "A step-by-step guide on creating and deploying custom AWS Lambda layers to include additional Python dependencies, featuring a bash script for building layers locally."
const subtitle = "2024-09-02"
const tags = [
      "AWS",
      "Lambda",
      "Layer",
      "Python",
      "Dependencies"
    ]
</script>
# Creating and Deploying Custom Lambda Layers for Python Functions
<Hero :title="empty_string" :subtitle="prettyDate(subtitle)"/>
<Share :title="title" :shortDescription="shortDescription" :tags="tags"/>

AWS (Python) Lambda allows you to execute small code snippets in response to various triggers, such as API calls or the placement of an object in an S3 bucket. When a Lambda function is triggered, a compute instance is launched to execute the code. To minimize latency, the function's runtime environment is kept lightweight, typically consisting of only Python 3.12 and a few essential packages.

## Problem: Adding Dependencies Beyond the Default Runtime

By default, a Python Lambda function includes only basic packages and `boto3` for accessing AWS services. If your code requires additional packages, such as `sqlalchemy`, the function will fail unless those dependencies are included.

## Solution: Creating a Custom Lambda Layer

A Lambda layer allows you to include additional packages that your function requires. While many prebuilt layers are available, you may need to create a custom layer to meet specific dependencies.

### Step 1: Prepare the Requirements File

Create a `requirements.txt` file listing the packages your function needs:

```txt
sqlalchemy
```

### Step 2: Build and Package the Layer

Use the following bash script to install the required packages and create a zip file containing the dependencies:

```bash
#!/bin/bash

# Remove old zip file if it exists
if [ -f "layers/custom-dependencies.zip" ]; then
    rm layers/custom-dependencies.zip
fi

# Remove old virtual environment if it exists
if [ -f "venv/" ]; then
    rm -rf venv/
fi

# Create a new virtual environment
python3.12 -m venv venv
source venv/bin/activate

# Install packages into the virtual environment
pip install --platform=manylinux2014_x86_64 --target=venv/lib/python3.12/site-packages/ --python-version=3.12 --only-binary=:all: -r requirements.txt

# Package the installed packages into a zip file
cp -r venv/ python/
zip -r -qq layers/custom-dependencies.zip python/lib/python3.12/site-packages -x '*boto3*' -x '*botocore*'

# Clean up
rm -rf python/
rm -rf venv/

echo "Zip file created successfully!"
```

The script will produce a zip file containing your custom dependencies.

**Note:** The zip file must not exceed 50MB, and the total size of all layers and the function code when unzipped cannot exceed 250MB.

### Step 3: Upload the Layer to AWS

1. Navigate to the [Lambda Layers page](https://console.aws.amazon.com/lambda/home#/layers) in the AWS Lambda console.
2. Click **Create layer**.
3. Provide a name and optional description for your layer.
4. Upload the zip file you created.
5. Choose `x86_64` as Compatible architectures.
6. Choose `Python 3.12` as Compatible runtime.
7. Click **Create**.
8. Copy the ARN of the newly created layer.

### Step 4: Attach the Layer to Your Lambda Function

1. Go to the [Lambda Functions page](https://console.aws.amazon.com/lambda/home#/functions) in the AWS Lambda console.
2. Select the function you want to configure.
3. Under **Layers**, click **Add a layer** (can be found at the bottom under **Code**).
4. Choose the appropriate layer source.
5. If using an ARN, enter the ARN and click **Verify**.
6. Click **Add** to attach the layer.

## References

- [Creating and Deleting Layers](https://docs.aws.amazon.com/lambda/latest/dg/creating-deleting-layers.html)
- [Adding Layers](https://docs.aws.amazon.com/lambda/latest/dg/adding-layers.html)
- [Python Layers](https://docs.aws.amazon.com/lambda/latest/dg/python-layers.html)