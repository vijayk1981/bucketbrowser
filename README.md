# Bucket Browser

  

A simple web application that allows users to browse, upload, and manage files using AWS Amplify and React. Users can generate pre-signed URLs with custom or preset durations for individual files.

  

## Features

  

- List files and folders

- Upload files

- Delete files

- Navigate through folders

- Generate pre-signed URLs for individual files with custom or preset durations

- Copy pre-signed URLs to clipboard

  

## Installation and Setup

  

### Prerequisites

  

- Node.js and npm installed

- AWS account with the AWS CLI configured

  

### Steps

  

1. Clone the repository:

    git clone https://git-codecommit.us-east-1.amazonaws.com/v1/repos/bucketbrowser

    cd file-browser

2. Install dependencies:

    npm install

3. Configure the Amplify project:

    amplify init

4. Add auth to the Amplify project:

    amplify add auth

*Follow the prompts to configure Amazon Cognito pool for your project.*

5. Add storage to the Amplify project:

    amplify add storage

*Follow the prompts to configure an Amazon S3 bucket for your project.*

6. Deploy the Amplify project:

    amplify push

7. Start the development server:

    npm start

  

The application will open in your default web browser at `http://localhost:3000`.

  

## Usage

  

- To upload a file, click the "Choose File" button and select a file, then click "Upload".

- To delete a file, click the trash icon next to the file.

- To generate a pre-signed URL with a custom duration, click the link icon next to the file and enter the desired duration in seconds.

- To generate a pre-signed URL with a preset duration, click one of the preset duration buttons next to the file (1 Hour, 24 Hours, 1 Week, 2 Weeks, or 1 Year).

- To navigate through folders, click on the folder name in the file list.

- To go back to the previous folder, click the "Back" button.

  

## Contributing

  

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

  

## License

  

[MIT](https://choosealicense.com/licenses/mit/)