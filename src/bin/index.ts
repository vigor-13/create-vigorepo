#!/usr/bin/env node
import * as CLI from '../commands';

const bootstrap = async () => {
  const cli = new CLI.CommandLoader();
  cli.init();
};

bootstrap();
