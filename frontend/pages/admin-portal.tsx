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
import { useMsalInstance } from '../contexts/MsalProvider';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { Client } from '@microsoft/microsoft-graph-client';
import { InteractionType } from '@azure/msal-browser';
import { loginRequest } from '../pages/authConfig';
import NextLink from "next/link";
import { Link } from "@nextui-org/link";


//=============================================================
//                        Admin Portal
//=============================================================
// Quick links to Azure dashboard and user invite button.

export default function IndexPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [newUserEmail, setNewUserEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const msalInstance = useMsalInstance();

  const handleAddUser = async () => {
    setIsSubmitting(true);
    setStatusMessage("");
    console.log('Submitting new user email:', newUserEmail);

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
        interactionType: InteractionType.Popup,
        scopes: loginRequest.scopes,
      });

      const client = Client.initWithMiddleware({ authProvider });

      const invitation = {
        invitedUserEmailAddress: newUserEmail,
        inviteRedirectUrl: 'https://localhost:3000',
        sendInvitationMessage: true,
        messageLanguage: 'en-US',
        roles: ["Member"],
        jobTitle: "Default"
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
                  <p>
                    To search for currently-existing users or add new users, you can use this page. To remove users, view logs, and manage permissions, please refer to the project&lsquo;s <Link href="https://portal.azure.com/">Azure Active Directory</Link>.
                  </p>
                  <div className="flex flex-col items-center py-3">
                    <Button onPress={onOpen} color="primary" className="mb-4">New Invitation</Button>
                  </div>
                  <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
                    <ModalContent>
                      {(onClose) => (
                          <>
                            <ModalHeader className="flex flex-col gap-1">
                              New Invitation
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
                  <UsersTable />
                </CardBody>
              </Card>
            </div>
          </section>
        </DefaultLayout>
      </PrivateRoute>
  );
}
