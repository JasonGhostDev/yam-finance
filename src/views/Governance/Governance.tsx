import React, { useEffect, useCallback, useState } from "react";
import { Container, Spacer, Card, CardTitle, CardContent, Separator, Surface, Button } from "react-neu";

import Page from "components/Page";
import PageHeader from "components/PageHeader";
import Split from "components/Split";

import RegisterVoteNotice from "../Home/components/RegisterVoteNotice";
import RegistrationButton from 'components/RegistrationButton';
import SeparatorGrid from "components/SeparatorWithCSS";
import Box from "components/BoxWithDisplay";
import styled from "styled-components";
import DelegateForm from "components/DelegateForm";
import YamLoader from "components/YamLoader";
import UnlockWalletModal from "components/UnlockWalletModal";

import useGovernance from "hooks/useGovernance";
import { useWallet } from "use-wallet";

import { ProposalEntry, StyledProposalContentInner } from "./components/Proposal";

const ASTRONAUTS = ["👨‍🚀", "👨🏻‍🚀", "👨🏼‍🚀", "👨🏽‍🚀", "👨🏾‍🚀", "👩‍🚀", "👩🏻‍🚀", "👩🏼‍🚀", "👩🏽‍🚀", "👩🏾‍🚀‍", "👩🏿‍🚀"];

const Governance: React.FC = () => {
  const { account } = useWallet();
  const {
    proposals,
    onVote,
    onRegister,
  } = useGovernance();

  const [astronaut, setAstronaut] = useState("👨‍🚀");
  const [unlockModalIsOpen, setUnlockModalIsOpen] = useState(false);

  const updateAstronaut = useCallback(() => {
    const newAstro = ASTRONAUTS[Math.floor(Math.random() * ASTRONAUTS.length)];
    setAstronaut(newAstro);
  }, [setAstronaut]);

  useEffect(() => {
    const refresh = setInterval(updateAstronaut, 1000);
    return () => clearInterval(refresh);
  }, [updateAstronaut]);


  // TODO Move these to their own component
  const handleDismissUnlockModal = useCallback(() => {
    setUnlockModalIsOpen(false);
  }, [setUnlockModalIsOpen]);

  const handleUnlockWalletClick = useCallback(() => {
    setUnlockModalIsOpen(true);
  }, [setUnlockModalIsOpen]);

  return (
    <Page>
      <PageHeader icon={`${astronaut}`} subtitle="View and vote on proposals below!" title="Govern" />

      <Container>
        <RegisterVoteNotice />
        <Spacer size="md" />
        <Split>
          <Spacer />
          <Button full text="Forum" href="https://forum.yam.finance" variant="tertiary" />
          <Spacer />
          <Button full text="Off-chain Voting" href="https://snapshot.page/#/yam" variant="tertiary" />
          <Spacer />
          <RegistrationButton width='125px' />
          <Spacer />
        </Split>
        <Spacer size="md" />
        {account &&
        <Card>
          <CardTitle text="On-chain Proposals" />
          <Spacer size="sm" />
          <CardContent>
            {proposals ? (
              <>
                <Box display="grid" alignItems="center" paddingLeft={4} paddingRight={4} paddingBottom={1} row>
                  <StyledProposalContentInner>
                    <StyledDescriptionMain>Description</StyledDescriptionMain>
                    <SeparatorGrid orientation={"vertical"} stretch={true} gridArea={"spacer1"} />
                    <StyledStateMain>State</StyledStateMain>
                    <SeparatorGrid orientation={"vertical"} stretch={true} gridArea={"spacer2"} />
                    <StyledButtonMain>Action</StyledButtonMain>
                  </StyledProposalContentInner>
                </Box>
                <Spacer size="sm" />
                {proposals && (
                  <Surface>
                    {proposals.map((prop, i) => {
                      if (i === 0) {
                        return <ProposalEntry key={prop.hash} prop={prop} onVote={onVote} onRegister={onRegister} />;
                      } else {
                        return [<Separator key={"seperator" + i}/>, <ProposalEntry key={prop.hash} prop={prop} onVote={onVote} onRegister={onRegister} />];
                      }
                    })}
                  </Surface>
                )}
              </>
            ) : (
              <YamLoader space={320}></YamLoader>
            )}
          </CardContent>
        </Card>}
        <Spacer size="md" />
        {account
          ? <DelegateForm />
          : (
            <>
              <Box row justifyContent="center">
                <Button onClick={handleUnlockWalletClick} text="Unlock wallet to delegate" variant="secondary" />
              </Box>
              <UnlockWalletModal isOpen={unlockModalIsOpen} onDismiss={handleDismissUnlockModal} />
            </>
          )
        }
      </Container>
    </Page>
  );
};

export const StyledButtonMain = styled.div`
  font-weight: 600;
  display: grid;
  grid-area: vote;
  margin-left: 10px;
  justify-content: center;
  @media (max-width: 768px) {
    flex-flow: column nowrap;
    align-items: flex-start;
  }
`;

export const StyledDescriptionMain = styled.span`
  font-weight: 600;
  display: grid;
  grid-area: desc;
  @media (max-width: 768px) {
    flex-flow: column nowrap;
    align-items: flex-start;
  }
`;

export const StyledStateMain = styled.span`
  font-weight: 600;
  margin-left: 5px;
  margin-right: 5px;
  display: grid;
  grid-area: state;
  justify-content: center;
  min-width: 67px;
  @media (max-width: 768px) {
    flex-flow: column nowrap;
    align-items: flex-start;
  }
`;

export default Governance;
