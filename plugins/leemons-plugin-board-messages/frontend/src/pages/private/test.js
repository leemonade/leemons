import { listProgramsRequest } from '@academic-portfolio/request';
import { getOverlapsRequest, listRequest, saveRequest } from '@board-messages/request';
import { Box, Button } from '@bubbles-ui/components';
import { listProfilesRequest } from '@users/request';
import { getCentersWithToken } from '@users/session';
import _ from 'lodash';
import React from 'react';

export default function Index() {
  async function getTestData() {
    const center = getCentersWithToken()[0].id;
    const {
      data: { items: iPrograms },
    } = await listProgramsRequest({
      page: 0,
      size: 9999,
      center,
    });
    const {
      data: { items: iProfiles },
    } = await listProfilesRequest({
      page: 0,
      size: 9999,
    });
    const centers = [center];
    const programs = _.map(iPrograms, 'id');
    const profiles = _.map(iProfiles, 'id');
    return {
      centers,
      programs,
      profiles,
    };
  }

  async function list() {
    const data = await getTestData();
    const result = await listRequest({
      page: 0,
      size: 9999,
      filters: {
        internalName: 'bla bla',
        centers: data.centers,
        programs: data.programs,
        profiles: data.profiles,
        zone: 'modal',
        status: 'programmed',
      },
    });
    console.log(result);
  }

  async function createAdmin() {
    const data = await getTestData();
    const toSend = {
      internalName: 'Test 1',
      message: '<p>Gatitos powa</p>',
      url: 'https://google.es',
      textUrl: 'Llevame a google',
      zone: 'modal', // modal | dashboard
      publicationType: 'programmed', // immediately | programmed
      startDate: new Date('11/18/2024'),
      endDate: new Date('11/22/2024'),
      ...data,
    };
    console.log(toSend);
    const result = await saveRequest(toSend);
    console.log(result);
  }

  async function checkOverlaps() {
    const data = await getTestData();
    // Pasar lo mismo que se le pasaria al save id incluida si la hay
    const toSend = {
      internalName: 'Test 1',
      message: '<p>Gatitos powa</p>',
      url: 'https://google.es',
      textUrl: 'Llevame a google',
      zone: 'modal', // modal | dashboard
      publicationType: 'programmed', // immediately | programmed
      startDate: new Date('11/18/2024'),
      endDate: new Date('11/22/2024'),
      ...data,
    };
    console.log(toSend);
    const result = await getOverlapsRequest(toSend);
    console.log(result);
  }

  return (
    <Box>
      <Button onClick={list}>Listar</Button>
      <Button onClick={createAdmin}>Crear admin</Button>
      <Button onClick={checkOverlaps}>Coger solapamientos</Button>
    </Box>
  );
}
