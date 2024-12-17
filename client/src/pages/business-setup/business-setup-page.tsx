import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BusinessProfileForm } from "./components/business-profile-form";

export default function BusinessSetupPage() {
  const navigate = useNavigate();

  const handleSetupSuccess = () => {
    navigate("/dashboard");
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Business Profile Setup</CardTitle>
          <CardDescription>
            Please provide your business information to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BusinessProfileForm onSuccess={handleSetupSuccess} />
        </CardContent>
      </Card>
    </div>
  );
}