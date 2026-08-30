import { useEffect, useRef, useState } from "react";
import { FieldGroup } from "@/Components/ui/field";
import { FormInput } from "@/Components/ui/CustomUi/ReuseForm/Form";
import { Button } from "@/Components/ui/button";
import { AllImages } from "../../../../public/images/AllImages";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/schemas/auth";
import { FileWithPreview } from "@/Components/ui/CustomUi/ReuseForm/FileUpload";
import { Upload } from "lucide-react";
import z from "zod";
import { MdDelete } from "react-icons/md";
import tryCatchWrapper from "@/utils/tryCatchWrapper";
import { getImageUrl } from "@/helpers/config/envConfig";
import useUserData from "@/hooks/useUserData";
import { useUpdateProfileMutation } from "@/redux/features/profile/profileApi";
import Cookies from "js-cookie";

const EditProfile = () => {
  const maxFiles = 1;
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });
  const serverUrl = getImageUrl();
  const [updateProfile] = useUpdateProfileMutation();

  const profileData = useUserData();

  const profileImage = AllImages.profile;
  const [imageUrl, setImageUrl] = useState(profileImage);
  const [value, setValue] = useState<FileWithPreview[]>([]);

  useEffect(() => {
    if (profileData?.profileImage) {
      setImageUrl(`${serverUrl}${profileData.profileImage}`);
    } else {
      setImageUrl(profileImage);
    }
    form.setValue("email", profileData?.email);
    form.setValue("fullName", profileData?.fullName ?? "");
  }, [form, profileData?.email, profileData?.fullName, profileData?.profileImage, profileImage, serverUrl]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // If files exceed the max limit, show alert
    if (value.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Map files to include preview and file object
    const newFiles: FileWithPreview[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file), // Set the preview for image
    }));

    // Update imageUrl for preview
    if (newFiles.length > 0) {
      setImageUrl(newFiles[0].preview); // Update the image URL for the preview
    }

    setValue((prevFiles) => [...prevFiles, ...newFiles]);

    // Reset input value to allow selecting the same file again
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...value];
    // Clean up the object URL to prevent memory leaks
    URL.revokeObjectURL(newFiles[index].preview);
    newFiles.splice(index, 1);
    setValue(newFiles); // Update state after removing file
    setImageUrl(profileImage); // Reset to the original image if file is removed
  };



  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onFinish = async (data: z.infer<typeof profileSchema>) => {
    const formData = new FormData();
    if (value.length > 0) {
      formData.append("profileImage", value[0].file);
    }
    formData.append("data", JSON.stringify({ fullName: data.fullName }));
    const res = await tryCatchWrapper(
      updateProfile,
      { body: formData },
      "Updating Profile..."
    );

    if (res?.success) {
      Cookies.set("photoop_accessToken", res?.data?.accessToken);
      window.dispatchEvent(new Event("tokenUpdated"));
      value.forEach((f) => URL.revokeObjectURL(f.preview));
      setValue([]);
      form.reset();
    }

  };

  return (
    <div className="mt-10 rounded-xl">
      <div className="mt-5 flex flex-col justify-center items-start gap-x-4">
        <div className="relative flex  items-center gap-2 mb-10">
          <img
            width={1000}
            height={1000}
            className="h-40 w-40 relative rounded-full border border-secondary-color object-contain"
            src={imageUrl}
            alt="Profile"
          />
          <div className={`space-y-4  mt-5`}>
            {/* Upload Button */}
            <button
              type="button"
              onClick={handleClick}
              className="flex items-center justify-center gap-2 rounded-md border-2 border-dashed border-secondary-color text-background bg-foreground px-3 py-2 cursor-pointer"
            >
              <Upload className="size-3.5" />
              <p className="text-xs">
                Click to upload
              </p>
            </button>

            {/* Hidden Input */}
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept={"image/*"}
              multiple={maxFiles > 1}
            />

            {/* Preview Grid */}
            <div>
              {value.length > 0 && (
                <div className="flex gap-4">
                  {value.map((item, index) => (
                    <div
                      key={index}
                      className="relative p-2 group rounded-md border border-secondary-color bg-base-color/5 overflow-hidden w-fit flex items-center justify-center gap-2"
                    >


                      {/* File Info */}
                      <div className="">
                        <p className="text-xs font-medium truncate" title={item.file.name}>
                          {item.file.name?.slice(0, 40)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(item.file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>


                      <MdDelete className="size-4 text-error cursor-pointer" onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <form className="max-w-3xl" onSubmit={form.handleSubmit(onFinish)}>
        <FieldGroup>
          <FormInput control={form.control} name="fullName" label="Full Name" />
          <FormInput control={form.control} name="email" label="Email" disabled />
          <Button className="py-5 text-base" type="submit">Update Profile</Button>
        </FieldGroup>
      </form>
    </div >
  );
};

export default EditProfile;
