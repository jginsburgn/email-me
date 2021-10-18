#!/usr/bin/env node
'use strict';
const nodemailer = require('nodemailer');
const commandLineArgs = require('command-line-args');
const optionDefinitions = [
  {
    name: 'subject',
    type: String,
    defaultOption: true,
    defaultValue: 'Hello',
  },
  {
    name: 'to',
    type: String,
    defaultValue: 'jgn1055@gmail.com',
  },
  {
    name: 'body',
    type: String,
    defaultValue: 'Empty body.',
  },
  {
    name: 'attachment',
    alias: 'a',
    type: String,
  },
  {
    name: 'eattachment',
    alias: 'A',
    type: String,
  },
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
  },
];
const options = commandLineArgs(optionDefinitions);

if (options.help) {
  console.log('Send an email from j@wake.guru.');
  console.log('Options: subject, to, body, attachment, eattachment (encrypted attachment), help.');
  console.log('Do not use attachment and eattachment together.');
  console.log('To encrypt something do: openssl enc -aes-256-cbc -salt -md sha256 -out attachment.enc -in <target>');
  return;
}

/**
 * Sends an email with predefined values.
 */
async function email() {
  const transporter = nodemailer.createTransport({
    host: 'jona.than.ml',
    port: 587,
    tls: {
      rejectUnauthorized: false,
      ciphers: 'SSLv3',
    },
    auth: {
      user: 'j@wake.guru',
      pass: 'password',
    },
  });

  const message = {
    from: '"Jonathan Ginsburg" <j@wake.guru>',
    to: options.to,
    subject: options.subject,
    text: options.body,
  };

  if (options.body !== undefined) {

  }

  if (options.eattachment !== undefined) {
    message.attachments = [{
      path: options.eattachment,
      contentType: 'application/octet-stream',
      filename: 'attachment.enc',
    }];
    message.text = [options.body, 'Attachment encrypted; decrypt with the provided password using: openssl enc -aes-256-cbc -salt -md sha256 -in attachment.enc -d -out <your-choosing>'].join('\n');
  }

  if (options.attachment !== undefined) {
    message.attachments = [{
      path: options.attachment,
    }];
  }

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
}

email().catch(console.error);
