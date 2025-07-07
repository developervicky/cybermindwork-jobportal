"use client";
import { UploadDropzone } from "@/lib/uploadthing";
import { X } from "lucide-react";
import Image from "next/image";
import { FC } from "react";

interface FileUploadProps {
  onChange: (fileUrl?: string, fileName?: string) => void;
  fileUrl: string | undefined;
  fileName?: string;
  endPoint: "companyLogo";
}

const FileUpload: FC<FileUploadProps> = ({
  endPoint,
  onChange,
  fileName,
  fileUrl,
}) => {
  // const [fileName, setFileName] = useState("");
  const fileType = fileName?.split(".").pop();

  if (fileUrl && fileType !== "pdf") {
    return (
      <div className="flex w-full items-center justify-center">
        <div className="relative h-20 w-20">
          <Image
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fill
            priority
            src={fileUrl}
            alt="upload_image"
            className="rounded-full"
          />
          <button
            onClick={() => onChange("")}
            className="absolute top-0 right-0 cursor-pointer rounded-full bg-rose-500 p-1 text-white shadow-sm"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <UploadDropzone
      appearance={{
        container: "!py-2",
        button: "!mt-2 !bg-btn-primary !w-fit !h-fit px-2 py-1",
        label: "!mt-1",
      }}
      endpoint={endPoint}
      onClientUploadComplete={(res) => {
        // console.log(res);
        // setFileName(res[0].name);
        onChange(res[0].ufsUrl, res[0].name);
      }}
      onUploadError={(err: Error) => {
        console.log(err);
      }}
    />
  );
};

export default FileUpload;
