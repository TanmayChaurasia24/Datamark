"use client";

import { useState } from "react";
import Appbar from "../components/Appbar";
import Button from "../components/Button";
import { useRouter } from "next/navigation";

export default function Home() {
  const [imgsSrc, setImgsSrc] = useState<string[]>([]);
  const [taskTitle, setTaskTitle] = useState(""); // Added state for title
  const router = useRouter();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (const file of files) {
        if (imgsSrc.length >= 4) break; // Limit to 4 images
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          setImgsSrc((imgs) => [...imgs, reader.result as string]);
        };
        reader.onerror = () => {
          console.error(reader.error);
        };
      }
    }
  };

  const removeImage = (index: number) => {
    setImgsSrc((imgs) => imgs.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // Example submission handling
    console.log("Task Title:", taskTitle);
    console.log("Uploaded Images:", imgsSrc);

    // Clear state after submission
    setTaskTitle("");
    setImgsSrc([]);
    router.push("/task");
  };

  return (
    <>
      <main>
        <div>
          <Appbar />
        </div>
        <div className="flex flex-col mt-10 items-center h-[80vh]">
          <h1 className="text-neutral-200 text-4xl text-center">Welcome to DataMark</h1>
          <p>Get the answer to your every question</p>

          <div className="mt-16">
            <div className="text-xl mb-4">Create Task</div>
            <div>
              <p className="font-bold mb-1">Task Details</p>
              <input
                type="text"
                name="title"
                id="title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)} // Controlled input
                placeholder="Enter the Title"
                className="rounded-lg w-[50vw] p-2 text-black"
              />
            </div>

            <div className="mt-6 cursor-pointer">
              <p className="font-bold mb-1">Upload Images (Max 4)</p>
              <div className="flex justify-center items-center flex-wrap gap-4">
                {imgsSrc.map((link, index) => (
                  <div key={index} className="relative">
                    <img
                      src={link}
                      alt={`Uploaded ${index + 1}`} // Improved alt attribute
                      className="h-[100px] w-[100px] object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white text-sm rounded-full p-1"
                      aria-label={`Remove image ${index + 1}`}
                    >
                      ×
                    </button>
                  </div>
                ))}

                {imgsSrc.length < 4 && (
                  <label
                    htmlFor="fileUpload"
                    className="bg-slate-400 h-[100px] w-[100px] rounded-lg flex justify-center items-center cursor-pointer"
                  >
                    <span className="text-white text-4xl">+</span>
                    <input
                      id="fileUpload"
                      onChange={onChange}
                      type="file"
                      multiple
                      className="hidden"
                      accept="image/*" // Restrict to images only
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="w-[100%] mt-5 flex justify-center items-center">
              <Button content="Submit Task" routeto="/task"/>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
