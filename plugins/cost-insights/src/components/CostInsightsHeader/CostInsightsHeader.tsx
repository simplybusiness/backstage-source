/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { Typography } from '@material-ui/core';
import useAsync from 'react-use/lib/useAsync';
import { useCostInsightsStyles } from '../../utils/styles';
import { Group } from '../../types';
import { identityApiRef, useApi } from '@backstage/core-plugin-api';

function useDisplayName(): string {
  const identityApi = useApi(identityApiRef);
  const state = useAsync(() => identityApi.getProfileInfo(), [identityApi]);
  return state.loading ? '' : state.value?.displayName || 'Mysterious Stranger';
}

type CostInsightsHeaderProps = {
  owner: string;
  groups: Group[];
  hasCostData: boolean;
  alerts: number;
};

const CostInsightsHeaderNoData = ({
  owner,
  groups,
}: CostInsightsHeaderProps) => {
  const displayName = useDisplayName();
  const classes = useCostInsightsStyles();
  const hasMultipleGroups = groups.length > 1;

  return (
    <>
      <Typography variant="h4" align="center" gutterBottom>
        <span role="img" aria-label="flushed-face">
          😳
        </span>{' '}
        Well this is awkward
      </Typography>
      <Typography className={classes.h6Subtle} align="center" gutterBottom>
        <b>Hey, {displayName}!</b> <b>{owner}</b> doesn't seem to have any cloud
        costs.
      </Typography>
      {hasMultipleGroups && (
        <Typography align="center" gutterBottom>
          Maybe we picked the wrong team, choose another from the menu above?
        </Typography>
      )}
    </>
  );
};

const CostInsightsHeaderAlerts = ({
  owner,
  alerts,
}: CostInsightsHeaderProps) => {
  const displayName = useDisplayName();
  const classes = useCostInsightsStyles();

  return (
    <>
      <Typography variant="h4" align="center" gutterBottom>
        <span role="img" aria-label="magnifying-glass">
          🔎
        </span>{' '}
        You have {alerts} thing{alerts > 1 && 's'} to look into
      </Typography>
      <Typography className={classes.h6Subtle} align="center" gutterBottom>
        <b>Hey, {displayName}!</b> We've identified{' '}
        {alerts > 1 ? 'a few things ' : 'one thing '}
        <b>{owner}</b> should look into next.
      </Typography>
    </>
  );
};

const CostInsightsHeaderNoAlerts = ({ owner }: CostInsightsHeaderProps) => {
  const displayName = useDisplayName();
  const classes = useCostInsightsStyles();

  return (
    <>
      <Typography variant="h4" gutterBottom align="center">
        <span role="img" aria-label="thumbs-up">
          👍
        </span>{' '}
        Your team is doing great
      </Typography>
      <Typography className={classes.h6Subtle} align="center" gutterBottom>
        <b>Hey, {displayName}!</b> <b>{owner}</b> is doing well. No major
        changes this month.
      </Typography>
    </>
  );
};

export const CostInsightsHeaderNoGroups = () => {
  const displayName = useDisplayName();
  const classes = useCostInsightsStyles();
  return (
    <>
      <Typography variant="h4" align="center" gutterBottom>
        <span role="img" aria-label="flushed-face">
          😳
        </span>{' '}
        Well this is awkward
      </Typography>
      <Typography className={classes.h6Subtle} align="center" gutterBottom>
        <b>Hey, {displayName}!</b> It doesn't look like you belong to any teams.
      </Typography>
    </>
  );
};

export const CostInsightsHeader = (props: CostInsightsHeaderProps) => {
  if (!props.hasCostData) {
    return <CostInsightsHeaderNoData {...props} />;
  }
  if (props.alerts) {
    return <CostInsightsHeaderAlerts {...props} />;
  }
  return <CostInsightsHeaderNoAlerts {...props} />;
};
