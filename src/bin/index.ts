#!/usr/bin/env node

import * as Commander from 'commander';
import * as packageJson from '../../package.json';
import {} from '../commands';

const bootstrap = async () => {
  const progrm = Commander.program;
  const { name, version, description } = packageJson;

  progrm.name(name).description(description).version(version);
  progrm.parse();
};

bootstrap();
