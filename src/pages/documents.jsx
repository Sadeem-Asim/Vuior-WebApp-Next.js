import React, { useEffect } from "react";
import DocumentCard from "@/components/documentCard";
import { db, storage } from "@/lib/firebaseConfig";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useUserAssets } from "@/context/userSpecificAssetsContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Tooltip } from "@nextui-org/react";

const DocumentPage = () => {
  const { userDocuments } = useUserAssets();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleDocumentUpload = async (event) => {
    if (!user || !user.id) {
      console.error("User is not authenticated or user ID is missing.");
      return;
    }

    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      const storageRef = ref(storage, `documents/${user.id}/${file.name}`);

      try {
        const snapshot = await uploadBytes(storageRef, file);
        const fileUrl = await getDownloadURL(snapshot.ref);

        await addDoc(collection(db, "documents"), {
          userId: user.id,
          documentUrl: fileUrl,
          documentName: file.name,
          documentType: file.type,
          uploadedAt: new Date(),
          purpose: "Resume",
          isDeleted: false,
        });

        toast({
          title: "Success",
          description: "Document Uploaded Successfully",
        });
      } catch (error) {
        console.error("Error uploading document:", error);
        toast({
          title: "Error",
          description: "Failed to upload document",
        });
      }
    }
  };

  const renderDocuments = (documents, purpose) => {
    const filteredDocs = documents.filter((doc) => doc?.purpose === purpose);

    if (filteredDocs.length === 0) {
      return <></>;
    }

    return (
      <>
        <h2 className="text-3xl font-bold mb-14 ml-4 text-button-gpt">
          {purpose === "Bill" ? "Bills Documents:" : "User Uploaded Documents:"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc, index) => (
            <div className="ml-4 mr-3">
              <DocumentCard key={index} document={doc} />
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="w-full">
      <Tooltip content="Upload the Document">
        <div className="flex justify-center my-4">
          <label
            htmlFor="documentUpload"
            className="flex items-center text-xl justify-center w-1/3 px-4 py-3 text-white bg-button-gpt rounded-lg cursor-pointer hover:bg-button-gpt"
          >
            Upload Document
          </label>
          <input
            type="file"
            id="documentUpload"
            className="hidden"
            onChange={handleDocumentUpload}
          />
        </div>
      </Tooltip>

      <section className="mt-28">
        {renderDocuments(userDocuments, "Bill")}
      </section>

      <section className="mt-28">
        {renderDocuments(userDocuments, "Resume")}
        {userDocuments.length === 0 && (
          <div className="flex flex-row items-center justify-center h-44 w-full">
            <div className="flex flex-col items-center justify-center bg-button-gpt text-white text-center w-2/3 h-24 rounded-2xl shadow-md ">
              <h1 className="text-md font-bold">No Documents Available</h1>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default DocumentPage;
