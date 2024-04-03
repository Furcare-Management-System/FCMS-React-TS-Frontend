import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Staffs from "./pages/Staffs";
import StaffForm from "./pages/StaffForm";
import PetOwners from "./pages/PetOwners";
import PetOwnerForm from "./pages/PetOwnerForm";
import NotFound from "./pages/NotFound";
import RequireAuth from "./contexts/RequireAuth";
import GuestLayout from "./components/GuestLayout";
import Users from "./pages/Users";
import ViewStaff from "./pages/ViewStaff";
import ViewPetOwner from "./pages/ViewPetOwner";
import Appointments from "./pages/Appointments";

import MainLayout from "./components/MainLayout";
import Roles from "./pages/Roles";
import PetOwnerAppointments from "./pages/PetOwnerAppointments";
import PetOwnerArchives from "./pages/PetOwnersArchives";
import Breeds from "./pages/Breeds";
import Species from "./pages/Species";
import StaffsArchives from "./pages/StaffsArchives";
import PetsArchives from "./pages/PetsArchives";
import ViewPet from "./pages/ViewPet";
import Pets from "./pages/Pets";
import TreatmentForm from "./pages/TreatmentForm";
import SettingsTabs from "./components/SettingsTabs";
import UserArchives from "./pages/UserArchives";
import Home from "./pages/Home";
import Payments from "./pages/Payments";

//petowner pages
import MyAppointments from "./pages/PetownerPages/MyAppointments";
import MyPets from "./pages/PetownerPages/MyPets";
import EditProfilePetOwner from "./pages/PetownerPages/EditProfilePetOwner";
import ViewStaffEdit from "./pages/ViewStaffEdit";
import Services from "./pages/Services";
import ViewMyPet from "./pages/PetownerPages/ViewMyPet";
import PetOwnerPaymentsHistory from "./pages/PetownerPages/PetOwnerPaymentsHistory";
import PetOwnerServicesAvailed from "./pages/PetownerPages/PetOwnerServicesAvailed";
import ServiceAvaileble from "./pages/ServiceAvailable";
import ForgotPassword from "./pages/ForgotPassword";
import VaccinationReturn from "./pages/VaccinationReturn";
import DewormingReturn from "./pages/DewormingReturn";
import PDTabs from "./components/PDTabs";

const roles = {
  ADMIN: "1",
  STAFF: "2",
  PETOWNER: "3",
};

function App() {
  return (
    <>
      <Routes>
        {/* Authenticated Routes */}

        <Route path="/" element={<MainLayout />}>
          <Route path="home" element={<Home />} />
          {/* Admin-Only Routes */}
          <Route
            path="admin/*"
            element={<RequireAuth allowedRoles={[roles.ADMIN, roles.STAFF]} />}
          >
            <Route path="roles" element={<Roles />} />

            <Route path="users" element={<Users />} />
            <Route path="users/archives" element={<UserArchives />} />

            <Route path="staffs" element={<Staffs />} />
            <Route path="staffs/new" element={<StaffForm />} />
            <Route path="staffs/:id" element={<StaffForm />} />
            <Route path="staffs/:id/view" element={<ViewStaff />} />
            <Route path="staffs/archives" element={<StaffsArchives />} />

            <Route path="petowners" element={<PetOwners />} />
            <Route path="petowners/new" element={<PetOwnerForm />} />
            <Route
              path="petowners/:id/appointments"
              element={<PetOwnerAppointments />}
            />
            <Route path="petowners/:id/view" element={<ViewPetOwner />} />
            <Route path="petowners/archives" element={<PetOwnerArchives />} />

            <Route path="pets/:id/view" element={<ViewPet />} />
            <Route path="pets" element={<Pets />} />
            <Route path="pets/archives" element={<PetsArchives />} />
            <Route path="pets/species" element={<Species />} />
            <Route path="pets/breeds" element={<Breeds />} />

            <Route path="appointments" element={<Appointments />} />
            <Route path="treatment/:id" element={<TreatmentForm />} />
            <Route path="paymentrecords" element={<PDTabs />} />
            <Route path="availed-services" element={<Services />} />
            <Route path="vaccinations" element={<VaccinationReturn />} />
            <Route path="deworming" element={<DewormingReturn />} />

            <Route path="myprofile" element={<ViewStaffEdit />} />
            <Route path="services" element={<ServiceAvaileble />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[roles.ADMIN]} />}>
            <Route path="/admin/settings" element={<SettingsTabs />} />
          </Route>
          {/* Staff-Only Routes */}
          {/* <Route
            path="staffs/*"
            element={<RequireAuth allowedRoles={[roles.STAFF]} />}
          >
            <Route path="staffs/:id/view" element={<ViewStaff />} />

            <Route path="petowners" element={<PetOwners />} />
            <Route path="petowners/new" element={<PetOwnerForm />} />
            <Route
              path="petowners/:id/appointments"
              element={<PetOwnerAppointments />}
            />
            <Route path="petowners/:id/view" element={<ViewPetOwner />} />

            <Route path="pets/:id/view" element={<ViewPet />} />
            <Route path="pets" element={<Pets />} />
            <Route path="pets/species" element={<Species />} />
            <Route path="pets/breeds" element={<Breeds />} />

            <Route path="appointments" element={<Appointments />} />
          </Route> */}

          {/* Pet Owner-Only Routes */}
          <Route
            path="petowner/*"
            element={<RequireAuth allowedRoles={[roles.PETOWNER]} />}
          >
            <Route path="pets" element={<MyPets />} />
            <Route path="pets/:id/view" element={<ViewMyPet />} />
            <Route path="appointments" element={<MyAppointments />} />
            <Route path="myprofile" element={<EditProfilePetOwner />} />
            <Route path="availed" element={<PetOwnerServicesAvailed />} />
            <Route path="payments" element={<PetOwnerPaymentsHistory />} />
          </Route>
        </Route>
        {/* </Route> */}

        {/* Guest Routes */}
        <Route path="/" element={<GuestLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
