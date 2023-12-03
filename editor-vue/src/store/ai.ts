import { defineStore } from "pinia";

export const useAiStore = defineStore("openai", () => {
  let OPENAI_API_KEY = ""; //import.meta.env.VITE_OPENAI_API_KEY || "";

  function getAPIKey() {
    if (!OPENAI_API_KEY.length) {
      OPENAI_API_KEY = prompt("Enter your OpenAI API key") || "";
    }

    if (!OPENAI_API_KEY.length) {
      return Promise.reject("No API key");
    }
  }

  async function openaiMaskEdit(
    imageBlob: Blob,
    maskBlob: Blob,
    size: string,
    prompt: string
  ) {
    getAPIKey();

    const formData = new FormData();
    formData.append("image", imageBlob, "image.png");
    formData.append("mask", maskBlob, "mask.png");
    formData.append("model", "dall-e-2");
    formData.append("prompt", prompt);
    formData.append("n", "1");
    formData.append("size", size || "512x512");
    formData.append("response_format", "b64_json");
    formData.append("user", OPENAI_API_KEY);

    return fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + OPENAI_API_KEY,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        return data.data[0].b64_json;
      })
      .catch((error) => {
        console.error(error); // Handle errors, like network issues or invalid JSON
      });
  }

  async function openaiGenerate(
    prompt: string,
    size: string,
    quality: "standard" | "hd"
  ) {
    getAPIKey();

    const formData = {
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: size || "1024x1024",
      quality: quality || "standard",
      response_format: "b64_json",
      user: OPENAI_API_KEY,
    };

    return fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + OPENAI_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        return data.data[0].b64_json;
      })
      .catch((error) => {
        console.error(error); // Handle errors, like network issues or invalid JSON
      });
  }

  async function openaiGenerateVariation(imageBlob: Blob, size: string) {
    getAPIKey();

    const formData = new FormData();

    formData.append("image", imageBlob, "image.png");
    formData.append("model", "dall-e-2");

    formData.append("n", "1");
    formData.append("size", size || "512x512");
    formData.append("response_format", "b64_json");
    formData.append("user", OPENAI_API_KEY);

    return fetch("https://api.openai.com/v1/images/variations", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + OPENAI_API_KEY,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        return data.data[0].b64_json;
      })
      .catch((error) => {
        console.error(error); // Handle errors, like network issues or invalid JSON
      });
  }

  async function stabilityMaskEdit(
    imageBlob: Blob,
    maskBlob: Blob,
    prompt: string
  ) {
    const engineId = "stable-diffusion-xl-1024-v1-0";
    const apiHost = "https://api.stability.ai";
    const apiKey = import.meta.env.VITE_STABILITY_API_KEY;

    if (!apiKey) throw new Error("Missing Stability API key.");

    // imageBlob = await resizeImageToMultipleOf64(imageBlob);
    // maskBlob = await resizeImageToMultipleOf64(maskBlob);

    // open blobs in new tabs
    const imageBlobUrl = URL.createObjectURL(imageBlob);
    window.open(imageBlobUrl, "_blank");
    const maskBlobUrl = URL.createObjectURL(maskBlob);
    window.open(maskBlobUrl, "_blank");

    // NOTE: This example is using a NodeJS FormData library. Browser
    // implementations should use their native FormData class. React Native
    // implementations should also use their native FormData class.
    const formData = new FormData();
    formData.append("init_image", imageBlob, "init_image.png");
    formData.append("mask_image", maskBlob, "mask_image.png");
    formData.append("mask_source", "MASK_IMAGE_WHITE");
    formData.append("text_prompts[0][text]", prompt);
    formData.append("text_prompts[0][weight]", "1");
    formData.append("clip_guidance_preset", "FAST_BLUE");
    formData.append("samples", "1");
    formData.append("steps", "10");

    const response = await fetch(
      `${apiHost}/v1/generation/${engineId}/image-to-image/masking`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Non-200 response: ${await response.text()}`);
    }

    interface GenerationResponse {
      artifacts: Array<{
        base64: string;
        seed: number;
        finishReason: string;
      }>;
    }

    const responseJSON = (await response.json()) as GenerationResponse;

    responseJSON.artifacts.forEach((image, index) => {
      // convert base64 to blob
      const byteString = atob(image.base64);
      const byteStringLength = byteString.length;
      const arrayBuffer = new ArrayBuffer(byteStringLength);
      const intArray = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteStringLength; i++) {
        intArray[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([intArray], { type: "image/png" });
      const blobURL = URL.createObjectURL(blob);
      window.open(blobURL, "_blank");
    });
  }

  function resizeImageToMultipleOf64(imageBlob: Blob) {
    return new Promise<Blob>((resolve, reject) => {
      // Create an image element
      const img = new Image();
      img.onload = () => {
        // Determine new dimensions, which are multiples of 64
        const width = Math.ceil(img.width / 64) * 64;
        const height = Math.ceil(img.height / 64) * 64;

        // Create a canvas element
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        // Draw the image to the canvas with the new dimensions
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        // Extract the image from the canvas as a Blob
        canvas.toBlob((newBlob) => {
          if (!newBlob) {
            reject(new Error("Failed to create blob from canvas"));
            return;
          }
          resolve(newBlob as Blob);
        }, "image/png"); // Adjust MIME type as needed ('image/png', 'image/jpeg', etc.)
      };
      img.onerror = (e) => {
        reject(new Error(`Image load error: ${e}`));
      };
      img.src = URL.createObjectURL(imageBlob);
    });
  }

  return {
    openaiMaskEdit,
    openaiGenerate,
    openaiGenerateVariation,
    stabilityMaskEdit,
  };
});
