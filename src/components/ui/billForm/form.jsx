import CurrencyFormat from "react-currency-format";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./form.module.css";
import { useAuth } from "../../../hooks/useAuth";
import StatusAutocompleteComponent from "@/components/autoComplete/status";
import { createBill } from "@/lib/clientControllers/bills";
import { useToast } from "@/hooks/use-toast";
import pdfToText from "react-pdftotext";
import { useParams } from "react-router-dom";
import { db, storage } from "@/lib/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { format, parse } from "date-fns";

export default function BillFormComponent({ bill = {}, update = false }) {
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setValue,
    watch,
  } = useForm();
  const [state, setState] = useState({});
  const [extractedText, setExtractedText] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { upload } = useParams();

  const isUploadMode = upload === "true";

  const extractText = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) {
        throw new Error("No file selected.");
      }
      const text = await pdfToText(file);
      console.log("Extracted Text:", text);
      const cleanedText = text.replace(/\s+/g, " ").toLowerCase();
      // Step 4: Extract values using regex
      const values = {
        name:
          cleanedText.match(
            /name\s*[:=]\s*["'“”]?\s*([^"'”\n]+)\s*["'”]?/i
          )?.[1] || "",

        amount:
          cleanedText
            .match(/amount\s*[:=]\s*([$]?\d[\d,.]*)/i)?.[1]
            ?.replace(/[^0-9.-]+/g, "") || "0",

        accountNumber:
          cleanedText.match(
            /account\s*number\s*[:=]\s*["'“”]?\s*([\d-]+)/i
          )?.[1] || "",

        dueDate:
          cleanedText.match(
            /bill\s*date\s*[:=]\s*["'“”]?\s*([a-zA-Z]+\s\d{1,2},\s\d{4})/i
          )?.[1] || "N/A",
        billDate:
          cleanedText.match(
            /due\s*by\s*["'“”]?\s*([a-zA-Z]+\s\d{1,2},?\s?\d{4})/i
          )?.[1] || "N/A",
      };
      // Step 5: Clean extracted values
      const cleanValues = (values) =>
        Object.fromEntries(
          Object.entries(values).filter(
            ([key, value]) => value !== "" && value != null
          )
        );
      const cleanedValues = cleanValues(values);
      if (cleanedValues["dueDate"] !== "N/A") {
        cleanedValues["dueDate"] = format(
          parse(cleanedValues["dueDate"], "MMMM d, yyyy", new Date()),
          "yyyy-MM-dd"
        );
      }

      setExtractedText(cleanedValues);
      console.log(extractedText);
      for (const [key, value] of Object.entries(cleanedValues)) {
        console.log(key, value);
        setValue(key, value); // Dynamically set form values
      }
      console.log("Extracted Values:", cleanedValues);
      // Step 1: Upload file to storage
      const storageRef = ref(storage, `documents/${user?.id}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(snapshot.ref);

      // Step 2: Add document metadata to Firestore
      const documentsCollection = collection(db, "documents");
      await addDoc(documentsCollection, {
        userId: user.id,
        documentUrl: fileUrl,
        documentName: file.name,
        documentType: file.type,
        uploadedAt: new Date(),
        purpose: "Bill",
      });

      // Notify user of successful upload
      toast({
        title: "Success",
        description: "Document Uploaded Successfully",
      });
    } catch (error) {
      console.error("Failed to extract text from PDF:", error);
      toast({
        title: "Error",
        description: "Failed to extract text. Please try again.",
      });
    }
  };

  const onSubmit = async (formData) => {
    try {
      setState({});
      const action = createBill;
      formData.user_id = user?.id;
      formData.status = "unpaid";
      let file = formData.uploadBill[0];
      console.log(file);

      const storageRef = ref(storage, `documents/${user?.id}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(snapshot.ref);

      // Step 2: Add document metadata to Firestore
      const documentsCollection = collection(db, "documents");

      console.log(user.id, file.name, fileUrl, file.name, file.type);
      await addDoc(documentsCollection, {
        userId: user.id,
        documentUrl: fileUrl,
        documentName: file.name,
        documentType: file.type,
        uploadedAt: new Date(),
        purpose: "Bill",
      });

      formData.uploadBill = null;

      await action(formData);
      setState({ success: true });
      toast({
        title: "Bill Created Successfully",
        description:
          "Bill with the provided information has been created successfully.",
      });
    } catch (error) {
      console.error("Error creating bill:", error);
    }
  };

  useEffect(() => {
    if (state?.success) {
      navigate("/bills");
    }
  }, [state, navigate]);

  console.log(watch("amount"));
  let formLabels = {
    name: "Bill Name",
    amount: "Bill Amount",
    dueDate: "Bill Due Date",
    accountNumber: "Bill Account Number",
    uploadBill: "Upload Bill",
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={true}
      size="3xl"
      onClose={() => navigate(-1)}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader>{isUploadMode ? "Upload " : "Create "}Bill</ModalHeader>

          <ModalBody>
            {state?.error && <div className="error">{state.error}</div>}
            <div className={styles.formElementsWrapper}>
              <Input
                type="file"
                onChange={extractText}
                isInvalid={!!errors.uploadBill}
                accept=".pdf,.jpg,.png"
                radius="sm"
                variant="bordered"
                errorMessage={
                  !!errors.uploadBill && "Please provide the bill name"
                }
                label={formLabels.uploadBill}
                labelPlacement="outside"
                // required

                {...register("uploadBill", { required: true })}
              />
            </div>
            <div className={styles.formWrapper}>
              <div className={styles.formElementsWrapper}>
                <Input
                  className={styles.formInput}
                  errorMessage={!!errors.name && "Please provide the bill name"}
                  isInvalid={!!errors.name}
                  label={formLabels.name}
                  labelPlacement="outside"
                  {...register("name", { required: true })}
                  radius="sm"
                  type="text"
                  variant="bordered"
                />
                <CurrencyFormat
                  customInput={Input}
                  label={formLabels.amount}
                  isInvalid={!!errors.amount}
                  labelPlacement="outside"
                  onValueChange={(values) => {
                    const { floatValue } = values;
                    setValue("amount", floatValue || ""); // Set the float value or an empty string if undefined
                  }}
                  {...register("amount", {
                    required: "Please provide the bill amount",
                  })}
                  radius="sm"
                  type="text"
                  variant="bordered"
                  errorMessage={
                    !!errors.amount && "Please provide the bill amount"
                  }
                  className={styles.formInput}
                  prefix="$"
                  thousandSeparator={true}
                />
              </div>
              <div className={styles.formElementsWrapper}>
                <Input
                  className={styles.formInput}
                  errorMessage={
                    !!errors.accountNumber &&
                    "Please provide the account number"
                  }
                  isInvalid={!!errors.accountNumber}
                  label={formLabels.accountNumber}
                  labelPlacement="outside"
                  {...register("accountNumber", { required: true })}
                  radius="sm"
                  type="text"
                  variant="bordered"
                />
                <Input
                  className={styles.formInput}
                  // defaultValue={extractedText?.dueDate || ''}
                  // value={extractedText?.dueDate || ''}
                  errorMessage={
                    !!errors.dueDate && "Please provide the due date"
                  }
                  isInvalid={!!errors.dueDate}
                  label={formLabels.dueDate}
                  labelPlacement="outside"
                  {...register("dueDate", { required: true })}
                  radius="sm"
                  type="date"
                  variant="bordered"
                />
              </div>
            </div>
          </ModalBody>

          <ModalFooter className={styles.footer}>
            <Button
              className={styles.footerButton}
              radius="sm"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: "#10a37f", color: "#fff" }}
              className={styles.footerButton}
              isDisabled={!!state?.success}
              isLoading={isSubmitting}
              radius="sm"
              type="submit"
            >
              {isUploadMode ? "Upload" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}

const formatDateForInput = (dateString) => {
  const date = new Date(dateString); // Parse the string into a Date object
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  console.log("saadia maam", `${year}-${month}-${day}`);
  return `${year}-${month}-${day}`; // Format as YYYY-MM-DD
};
