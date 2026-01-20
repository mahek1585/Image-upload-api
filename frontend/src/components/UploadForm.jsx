import React, { useState } from "react";
import axios from "axios";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setMessage("");
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select an image first");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    // try {
    //   const res = await axios.post(
    //     "http://localhost:5000/api/upload",
    //     formData
    //   );

    try{
     const res = await axios.post(
  "https://image-upload-api-x32u.onrender.com/api/upload",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
);


      setMessage(res.data.message || "Image uploaded successfully ✅");

      // ✅ RESET FORM AFTER SUCCESS
      setFile(null);
      setPreview(null);
    } catch (err) {
      setMessage(err.response?.data?.message || "Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1503264116251-35a269479413')",
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Card */}
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        
        {/* ✅ FIXED HEADING */}
        <h2 className="text-center text-2xl sm:text-3xl font-semibold tracking-wide mb-1">
          Image Upload
        </h2>
        <p className="text-center text-sm text-white/70 mb-6">
          Upload & preview your image
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Upload Box */}
          {!preview && (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/40 rounded-2xl p-6 cursor-pointer hover:border-white transition text-center">
              <div className="w-14 h-14 mb-3 flex items-center justify-center rounded-full bg-white/20">
                📷
              </div>
              <span className="text-sm font-medium">
                Click to choose an image
              </span>
              <span className="text-xs text-white/60 mt-1">
                JPG, PNG, JPEG
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}

          {/* Preview + Remove */}
          {preview && (
            <div className="flex flex-col items-center gap-3">
              <img
                src={preview}
                alt="Preview"
                className="w-36 h-36 object-cover rounded-2xl border border-white/30 shadow-lg"
              />

              <button
                type="button"
                onClick={handleRemove}
                className="text-sm text-red-300 hover:text-red-400 underline"
              >
                Remove Image
              </button>
            </div>
          )}

          {/* Upload Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition active:scale-95 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Image"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="text-center mt-4 text-sm text-emerald-300">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadForm;
