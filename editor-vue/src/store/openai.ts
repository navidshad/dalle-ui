import { defineStore } from "pinia";

export const useOpenAiStore = defineStore("openai", () => {
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  async function editImage(imageBlob: Blob, maskBlob: Blob, prompt: string) {
    // open blobs in new tabs
    // const imageBlobUrl = URL.createObjectURL(imageBlob);
    // const maskBlobUrl = URL.createObjectURL(maskBlob);
    // window.open(imageBlobUrl, "_blank");
    // window.open(maskBlobUrl, "_blank");

    // debugger;

    const formData = new FormData();
    formData.append("image", imageBlob, "image.png");
    formData.append("mask", maskBlob, "mask.png");
    formData.append("prompt", prompt);
    formData.append("n", "1");
    formData.append("size", "512x512");

    return fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + OPENAI_API_KEY,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Handle the response data
        // debugger;
        // return data[0].url;
        window.open(data.data[0].url, "_blank");
      })
      .catch((error) => {
        console.error(error); // Handle errors, like network issues or invalid JSON
      });
  }

  return { editImage };
});
