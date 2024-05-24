import DefaultLayout from "@/layouts/default";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import UsersTable from "@/components/UsersTable";
import React, { useState } from "react";
import PrivateRoute from '@/components/PrivateRoute';
import { useMsalInstance } from '../contexts/MsalProvider'; // Ensure the correct path
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { Client } from '@microsoft/microsoft-graph-client';
import { InteractionType } from '@azure/msal-browser'; // Ensure correct import
import { loginRequest } from '../pages/authConfig'; // Ensure the correct path

export default function IndexPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [newUserEmail, setNewUserEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const msalInstance = useMsalInstance();

  const handleAddUser = async () => {
    setIsSubmitting(true);
    setStatusMessage(""); // Reset the status message
    console.log('Submitting new user email:', newUserEmail); // Log email being submitted

    if (!msalInstance) {
      console.error('MSAL instance not initialized');
      setIsSubmitting(false);
      setStatusMessage("MSAL instance not initialized");
      return;
    }

    try {
      const authResult = await msalInstance.acquireTokenPopup(loginRequest);

      if (!authResult.account) {
        throw new Error('Could not authenticate');
      }

      const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(msalInstance, {
        account: authResult.account,
        interactionType: InteractionType.Popup, // Ensure InteractionType.Popup is correctly used
        scopes: loginRequest.scopes,
      });

      const client = Client.initWithMiddleware({ authProvider });

      const invitation = {
        invitedUserEmailAddress: newUserEmail,
        inviteRedirectUrl: 'https://myapp.contoso.com', // Change this to your app's URL
        sendInvitationMessage: true, // Ensure the user receives an email
        messageLanguage: 'en-US', // Set the language for the invitation email
        roles: ["Member"] // Set the user as a member
      };

      await client.api('/invitations').post(invitation);
      setStatusMessage("Invitation sent to " + newUserEmail);
    } catch (error) {
      console.error("Error adding user:", error);
      setStatusMessage("Error adding user: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <PrivateRoute>
        <DefaultLayout>
          <section className="flex flex-col items-center min-h-screen py-4">
            <div className="max-w-[100%] w-full text-center">
              <Card>
                <CardHeader className="flex flex-col items-center gap-3 py-8">
                  <h2 className="text-3xl">Admin Portal</h2>
                </CardHeader>
                <CardBody>
                  <div>
                    <Button onPress={onOpen} color="primary">
                      Add New User
                    </Button>
                  </div>

                  <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
                    <ModalContent>
                      {(onClose) => (
                          <>
                            <ModalHeader className="flex flex-col gap-1">
                              Add New User
                            </ModalHeader>
                            <ModalBody>
                              <Input
                                  autoFocus
                                  label="User's Email"
                                  placeholder="foo@umich.edu"
                                  variant="bordered"
                                  value={newUserEmail}
                                  onChange={(e) => setNewUserEmail(e.target.value)}
                              />
                            </ModalBody>
                            <ModalFooter>
                              <div className="flex flex-col items-center w-full">
                                <Button
                                    color="primary"
                                    onPress={handleAddUser}
                                    isLoading={isSubmitting}
                                    className="mb-4"
                                >
                                  {isSubmitting ? "Sending..." : "Send Invitation"}
                                </Button>
                                {statusMessage && (
                                    <div className="text-center">
                                      <p>{statusMessage}</p>
                                    </div>
                                )}
                              </div>
                            </ModalFooter>
                          </>
                      )}
                    </ModalContent>
                  </Modal>
                </CardBody>
              </Card>
            </div>
          </section>
        </DefaultLayout>
      </PrivateRoute>
  );
}
