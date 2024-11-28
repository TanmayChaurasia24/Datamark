import Image from "next/image";
import Appbar from "./components/Appbar";
import Button from "./components/Button";

export default function Home() {
  // Function to handle file input changes


  return (
    <>
      <main className="">
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
                placeholder="Enter the Title"
                className="rounded-lg w-[50vw] p-2 text-black"
              />
            </div>

            <div className="mt-6 cursor-pointer">
              <p className="font-bold mb-1">Upload Image</p>
              <div className="flex justify-center items-center">
                {/* Label wraps the visible UI */}
                <label
                  htmlFor="fileUpload"
                  className="bg-slate-400 h-[20vh] w-[10vw] rounded-lg flex justify-center items-center cursor-pointer"
                >
                  <span className="text-white text-4xl">+</span>
                </label>
                <input
                  type="file"
                  id="fileUpload"
                  className="hidden"

                />
              </div>
            </div>

            <div className="w-[100%] mt-5 flex justify-center items-center">
              <Button content="Submit Task" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}