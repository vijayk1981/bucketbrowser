import React, { useState, useEffect, useCallback } from 'react';
import { Storage } from 'aws-amplify';
import {
  Container,
  Typography,
  Button,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Grid } from '@mui/material';

const useStyles = {
  title: {
    marginTop: '32px',
  },
  input: {
    display: 'none',
  },
  button: {
    marginRight: '8px',
    marginBottom: '8px',
  },
};

const FileBrowser = () => {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentPath, setCurrentPath] = useState('');
  const [currentFolderName, setCurrentFolderName] = useState('');

  const fetchFiles = useCallback(async () => {
    try {
      const response = await Storage.list(currentPath, { maxKeys: 1000 });
      const fetchedFiles = response.results;

      if (Array.isArray(fetchedFiles)) {
        const currentPathDepth = currentPath.split('/').filter((part) => part.length > 0).length;
        const files = fetchedFiles.filter((file) => !file.key.endsWith('/') && file.key.split('/').filter((part) => part.length > 0).length === currentPathDepth + 1);
        const folders = fetchedFiles.filter((file) => file.key.endsWith('/') && file.key.split('/').filter((part) => part.length > 0).length === currentPathDepth + 1);
        setFiles([...folders, ...files]);
      } else {
        console.error('Unexpected response from Storage.list:', fetchedFiles);
        setFiles([]);
      }
    } catch (error) {
      console.error(error);
      setFiles([]);
    }
  }, [currentPath]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  function handleChange(e) {
    setFile(e.target.files[0]);
  }

  async function handleUpload() {
    if (!file) return;
    try {
      const uploadConfig = {
        contentType: file.type,
        progressCallback(progress) {
          const percentage = (progress.loaded / progress.total) * 100;
          setUploadProgress(parseFloat(percentage.toFixed(2)));
        },
      };
      await Storage.put(`${currentPath}${file.name}`, file, uploadConfig);
      fetchFiles();
      setUploadProgress(null);
    } catch (error) {
      console.error(error);
      setUploadProgress(null);
    }
  }

  async function handleDelete(file) {
    try {
      await Storage.remove(file.key);
      fetchFiles();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleGenerateURL(file) {
    const duration = parseInt(prompt('Enter the duration for the pre-signed URL in seconds:'));
    const url = await Storage.get(file.key, { expires: duration });
  
    try {
      await navigator.clipboard.writeText(url);
      alert('Pre-signed URL copied to clipboard.');
    } catch (err) {
      console.error('Failed to copy the URL to the clipboard:', err);
      alert(`Pre-signed URL: ${url}`);
    }
  }

  function isFolder(file) {
    return file.key.endsWith('/');
  }

  function handleFolderClick(folderKey) {
    const folderName = folderKey.slice(currentPath.length);
    setCurrentFolderName(folderName);
    setCurrentPath(folderKey);
  }

  async function handleGenerateURLWithPresetDuration(file, duration) {
    const url = await Storage.get(file.key, { expires: duration });
  
    try {
      await navigator.clipboard.writeText(url);
      alert(`Pre-signed URL for ${duration} seconds copied to clipboard: ${url}`);
    } catch (err) {
      console.error('Failed to copy the URL to the clipboard:', err);
      alert(`Pre-signed URL: ${url}`);
    }
  }
  
  function handleGoBack() {
    const pathParts = currentPath.split('/');
    pathParts.pop(); // Remove the empty string after the last '/'
    pathParts.pop(); // Remove the current folder
    const newPath = pathParts.join('/') + '/';
    setCurrentPath(newPath);
    setCurrentFolderName(pathParts[pathParts.length - 1]);
  }

  return (
    <Container>
      <Typography variant="h4" style={useStyles.title}>
        File Browser
      </Typography>
      {currentPath !== '' && (
        <Button variant="outlined" color="primary" onClick={handleGoBack} style={useStyles.button}>
          <ArrowBackIcon />
          Back
        </Button>
      )}
      <input
        accept="*/*"
        style={useStyles.input}
        id="contained-button-file"
        type="file"
        onChange={handleChange}
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" color="primary" component="span" style={useStyles.button}>
          Choose File
        </Button>
      </label>
      <Button variant="contained" color="primary" onClick={handleUpload} style={useStyles.button}>
        Upload
      </Button>
      {uploadProgress !== null && (
        <div style={{ width: '100%' }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="caption" style={{ textAlign: 'center', marginTop: '8px' }}>
            {`${uploadProgress}%`}
          </Typography>
          <Typography variant="h6" style={useStyles.title}>
            Currently navigating: {currentFolderName || 'Root'}
          </Typography>
        </div>
      )}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>Pre-signed URL</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file, index) => (
            <TableRow key={index}>
              <TableCell>
                {isFolder(file) ? (
                  <Button onClick={() => handleFolderClick(file.key)}>
                    <FolderIcon />
                    {file.key.slice(currentPath.length, file.key.lastIndexOf('/'))}
                  </Button>
                ) : (
                  file.key.slice(currentPath.length)
                )}
              </TableCell>
              <TableCell>
                {!isFolder(file) && (
                  <Grid container spacing={1}>
                    <Grid item>
                      <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(file)}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton edge="end" aria-label="generate-url" onClick={() => handleGenerateURL(file)}>
                        <LinkIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                )}
              </TableCell>
              <TableCell>
                {!isFolder(file) && (
                  <>
                    <TableCell>
                      <Button color="primary" onClick={() => handleGenerateURLWithPresetDuration(file, 3600)}>1 Hour</Button>
                      <Button color="primary" onClick={() => handleGenerateURLWithPresetDuration(file, 86400)}>24 Hours</Button>
                      <Button color="primary" onClick={() => handleGenerateURLWithPresetDuration(file, 604800)}>1 Week</Button>
                     </TableCell>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};
export default FileBrowser;