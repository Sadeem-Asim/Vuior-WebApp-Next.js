/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";

import { useAuth } from "../hooks/useAuth";
import { storage, db } from "../lib/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { Button } from "@nextui-org/button";
import { useToast } from "../hooks/use-toast";
import CurrencyFormat from "react-currency-format";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const ProfilePage: React.FC = () => {
  const { user }: any = useAuth();
  const { toast } = useToast();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  });
  const [autocomplete, setAutocomplete] = useState<any>();
  // const [searchValue, setSearchValue] = useState("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [phoneNo, setPhoneNo] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [profileLink, setProfileLink] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [redeemCode, setRedeemCode] = useState<string>("");
  const [redeemIsLoading, setRedeemIsLoading] = useState(false);
  // Set initial values based on the user data
  useEffect(() => {
    if (user) {
      setProfilePicture(user.avatar || "");
      setAddress(user.address || "1234 Elm Street, Springfield, USA");
      setDob(user.dob || "05-15-1995");
      setFirstName(user.firstName || "John");
      setLastName(user.lastName || "Doe");
      setEmail(user.email || "");
      setPhoneNo(user.phoneNo || "0317068136");
      setProfileLink(user.profileLink || "");
    }
  }, [user]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!user?.id) {
      console.error("User is not authenticated or user ID is missing.");
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const storageRef = ref(storage, `avatars/${user.id}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(snapshot.ref);

      await updateDoc(doc(db, "users", user.id), { avatar: fileUrl });
      setProfilePicture(fileUrl);

      toast({ title: "Success", description: "Profile Picture Updated" });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value);
    };

  const handleSubmit = async () => {
    if (!user?.id) {
      console.error("User is not authenticated or user ID is missing.");
      return;
    }
    if (phoneNo.trim().length !== 17) {
      toast({ title: "Error", description: "Phone no is not correct" });
      return;
    }

    setIsLoading(true);
    try {
      const userDocRef = doc(db, "users", user.id);
      await updateDoc(userDocRef, {
        name: `${firstName} ${lastName}`,
        phoneNo,
        address,
        dob,
      });

      toast({ title: "Success", description: "User Information Updated" });
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  async function redeemReferral() {
    setRedeemIsLoading(true);
    if (redeemCode.length < 5) {
      toast({ title: "Error", description: "Code not correct" });
      setRedeemIsLoading(false);
      return;
    }
    try {
      const response = await fetch(
        "https://redeemreferralcode-5risxnudva-uc.a.run.app/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            referralCode: redeemCode,
            userId: user?.id,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast({ title: "Success", description: result.message });

        console.log(result.message);
      } else {
        toast({ title: "Error", description: result.message });

        console.error(result.message);
      }
      setRedeemIsLoading(false);
    } catch (error) {
      toast({ title: "Error", description: "Code not correct" });
      setRedeemIsLoading(false);
      console.error("Error sending referral code:", error);
    }
  }
  const handlePlaceChanged = () => {
    console.log(autocomplete);
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      console.log(place.formatted_address);
      setAddress(place.formatted_address);
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-3/4 p-8 text-white rounded-lg shadow-lg md:w-2/3 lg:w-1/2 bg-gradient-to-br from-button-gpt to-black">
        <h2 className="mb-6 text-4xl font-bold text-center">User Profile</h2>

        {/* Profile Picture */}
        <div className="mb-6">
          <label className="block mb-2 text-white">Profile Picture:</label>
          <label
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-900 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300"
            htmlFor="profilePicture"
          >
            Upload Profile Picture
          </label>
          <input
            type="file"
            id="profilePicture"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          {profilePicture && (
            <img
              src={profilePicture}
              alt="Profile"
              className="w-32 h-32 mx-auto mt-4 rounded-full"
            />
          )}
        </div>

        {/* Input Fields */}
        {[
          {
            label: "First Name",
            value: firstName,
            onChange: handleInputChange(setFirstName),
          },
          {
            label: "Last Name",
            value: lastName,
            onChange: handleInputChange(setLastName),
          },
          {
            label: "Email",
            value: email,
            onChange: handleInputChange(setEmail),
          },

          // {
          //   label: "Address",
          //   value: address,
          //   onChange: handleInputChange(setAddress),
          // },
        ].map(({ label, value, onChange }) => (
          <div key={label} className="mb-6">
            <label className="block mb-2 text-white">{label}:</label>
            <input
              type="text"
              value={value}
              onChange={onChange}
              className="w-full p-2 text-black border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        ))}

        <div className="mb-6">
          <label className="block mb-2 text-white">Address:</label>
          {isLoaded && (
            <Autocomplete
              onLoad={(autocompleteInstance) =>
                setAutocomplete(autocompleteInstance)
              }
              onPlaceChanged={handlePlaceChanged}
            >
              <input
                type="text"
                placeholder="Search location"
                className="w-full p-2 text-black border border-gray-300 rounded-lg bg-gray-50"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Autocomplete>
          )}
        </div>
        {/* {
            label: "Phone Number",
            value: phoneNo,
            onChange: handleInputChange(setPhoneNo),
          }, */}

        <div className="mb-6">
          <label className="block mb-2 text-white">Phone No:</label>

          <CurrencyFormat
            type="text"
            value={phoneNo}
            onValueChange={(value) => {
              setPhoneNo(value.formattedValue);
            }}
            className="w-full p-2 text-black border border-gray-300 rounded-lg bg-gray-50"
            format="+1 (###) ###-####"
            // mask="_"
          />
        </div>
        {/* Date of Birth */}
        <div className="mb-6">
          <label className="block mb-2 text-white">Date of Birth:</label>
          <input
            type="date"
            value={dob}
            onChange={handleInputChange(setDob)}
            className="w-full p-2 text-black border border-gray-300 rounded-lg bg-gray-50"
            //  value=""
            // min="1997-01-01" max="2030-12-31"
          />
        </div>

        {/* Profile Link */}
        <div className="mb-6">
          <label className="block mb-2 text-white">Profile Link:</label>
          <input
            type="text"
            value={profileLink}
            readOnly
            className="w-full p-2 text-black border border-gray-300 rounded-lg bg-gray-50"
          />
        </div>

        {/* Save Changes */}
        <div className="flex justify-end">
          <Button
            isLoading={isLoading}
            disabled={isLoading}
            onPress={handleSubmit}
            className="bg-button-gpt hover:bg-button-gpt-hover"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
      <div className="flex flex-row justify-center w-full mt-12 ">
        <div className="w-1/2 px-10 py-3 text-center shadow-lg bg-gradient-to-br from-button-gpt to-black rounded-xl">
          <h2 className="mb-4 mt-4 text-3xl font-semibold text-white">
            Redeem Code
          </h2>
          <div className="px-6 py-2 font-mono text-lg font-bold tracking-wide text-gray-800 bg-gray-100 rounded-lg shadow-md">
            <input
              type="text"
              placeholder="Enter Code here"
              className="w-full px-8 py-2 text-gray-800 bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:to-button-gpt focus:border-transparent"
              onChange={(e) => {
                setRedeemCode(e.target.value);
              }}
            />
          </div>
          <div className="mt-8 mb-10">
            <Button
              children={redeemIsLoading ? "Redeeming..." : "Redeem Code"}
              className="justify-center font-bold text-white hover:bg-button-gpt-hover bg-button-gpt"
              isLoading={redeemIsLoading}
              variant="faded"
              type="submit"
              onPress={redeemReferral}
              disabled={redeemIsLoading}
            />
          </div>
        </div>
      </div>
    </div>
    // </LoadScript>
  );
};

export default ProfilePage;
