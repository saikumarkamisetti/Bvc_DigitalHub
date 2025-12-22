import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import DarkSection from "../components/ui/DarkSection";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { toast } from "react-toastify";

const Onboarding = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    department: "",
    year: "",
    rollNumber: "",
    bio: "",
    skills: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put("/users/onboarding", {
        ...formData,
        skills: formData.skills.split(",").map(s => s.trim())
      });

      toast.success("Profile completed");
      navigate("/home");
    } catch {
      toast.error("Onboarding failed");
    }
  };

  return (
    <>
      <Navbar />
      <DarkSection>
        <div className="max-w-xl mx-auto bg-[#161b22] p-8 rounded-xl border border-gray-700">
          <h1 className="text-3xl font-bold mb-6">
            Complete Your Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="department" placeholder="Department" onChange={handleChange} />
            <Input name="year" placeholder="Year" onChange={handleChange} />
            <Input name="rollNumber" placeholder="Roll Number" onChange={handleChange} />
            <Input name="skills" placeholder="Skills (comma separated)" onChange={handleChange} />
            <textarea
              name="bio"
              placeholder="Short Bio"
              className="w-full p-2 rounded bg-[#0d1117] border border-gray-600"
              onChange={handleChange}
            />

            <Button type="submit" className="w-full">
              Finish Setup
            </Button>
          </form>
        </div>
      </DarkSection>
    </>
  );
};

export default Onboarding;
