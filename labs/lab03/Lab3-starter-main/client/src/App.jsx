import { useState } from "react";

const App = () => {
  // what do we need to track
  const [singleFile, setSingleFile] = useState(null);
  const [multipleFiles, setMultipleFiles] = useState([]);

  const [displayImage, setDisplayImage] = useState(null); // display an image
  const [displayImages, setDisplayImages] = useState([]); // display multiple images
  const [displayDogImage, setDisplayDogImage] = useState(null); // display dog images

  const [message, setMessage] = useState("");

  // Handlers
  const handleSingleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSingleFile(e.target.files[0]);
    }
  };

  // fetch functions -> fetch a random single image
  const fetchSingleFile = async () => {
    try {
      const response = await fetch(`http://localhost:8000/fetch/single`);

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setDisplayImage(imageUrl);
    } catch (error) {
      console.error("Error fetching single file:", error);
    }
  };

  // fetch functions -> save single
  const handleSubmitSingleFile = async (e) => {
    e.preventDefault();
    if (!singleFile) {
      setMessage("Please select a file before uploading.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", singleFile);

      const response = await fetch(`http://localhost:8000/save/single`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Image upload failed");
      }
      setMessage("File uploaded successfully!");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // fetch functions -> fetch multiple
  const fetchMultiple = async () => {
    try {
      const response = await fetch("http://localhost:8000/fetch/multiple");
      const data = await response.json(); // This should be an array of filenames

      const imageUrls = data.map((filename) => `http://localhost:8000/uploads/${filename}`);
      
      setDisplayImages(imageUrls);
    } catch (error) {
      console.log("Error fetching multiple files:", error);
    }
  };

  // fetch functions -> fetch dog image
  const fetchDogImage = async () => {
    try {
      const response = await fetch(`https://dog.ceo/api/breeds/image/random`);
      const data = await response.json();
      setDisplayDogImage(data.message);
    } catch (error) {
      console.log("Error fetching dog image:", error);
    }
  };

  // fetch functions -> save dog image
  const saveDogImage = async (e) => {
    e.preventDefault();
    try {
      // Fetch the image data as a blob
      const response = await fetch(displayDogImage);
      const blob = await response.blob();
  
      // Create FormData and append the file
      const formData = new FormData();
      formData.append("file", blob, "dog-image.jpg");
  
      // Send the file to the backend
      const uploadResponse = await fetch(`http://localhost:8000/save/single`, {
        method: "POST",
        body: formData,
      });
  
      const data = await uploadResponse.json();
      setMessage(data.message);
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  

  return (
    <div>
      <p>{message}</p>
      <h2>Fetch Single Random Image</h2>
      <button onClick={fetchSingleFile}>Fetch Single File</button>
      {displayImage && (
        <div>
          <h3>Single File</h3>
          <img
            src={displayImage}
            alt="Display Image"
            style={{ width: "200px", marginTop: "10px" }}
          />
        </div>
      )}

      <form onSubmit={handleSubmitSingleFile}>
        <h2>Upload Single File</h2>
        <input type="file" onChange={handleSingleFileChange} />
        <button type="submit">Upload Single File</button>
      </form>

      <h2>Fetch Multiple Images</h2>
      <button onClick={fetchMultiple}>Grab Multiple Files</button>
      {displayImages.length > 0 ? (
        displayImages.map((image, index) => (
          <div key={index}>
            <img
              src={image}
              alt={`File ${index}`}
              style={{ width: "200px", marginTop: "10px" }}
            />
          </div>
        ))
      ) : (
        <p>No Images Available</p>
      )}

      <h2>Fetch Random Dog Image</h2>
      <button onClick={fetchDogImage}>Grab Dog</button>
      {displayDogImage && (
        <div>
          <img
            src={displayDogImage}
            alt="Dog"
            style={{ width: "200px", margin: "10px" }}
          />
          <button onClick={saveDogImage}>Take the Dog</button>
        </div>
      )}

    </div>
  );
};

export default App;