// SPDX-FileCopyrightText: 2024 Genome Research Ltd.
//
// SPDX-License-Identifier: MIT

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import fs from "fs";
import path from 'path';

// Paths to the key and certificate files
const keyPath = "/localhost.key";
const certPath = "/localhost.crt";

// Check if both the key and certificate files exist
const httpsConfig =
  fs.existsSync(keyPath) && fs.existsSync(certPath)
    ? {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      }
    : false;

// Determine if the environment is development
const isDevelopment = process.env.NODE_ENV === 'development';

export default defineConfig({
  plugins: [react(), viteTsconfigPaths()],
  resolve: {
    alias: {
      '@tol/tol-ui': isDevelopment
        ? path.resolve(__dirname, 'node_modules/@tol/tol-ui/src')
        : path.resolve(__dirname, 'node_modules/@tol/tol-ui/dist'),
    },
  },
  build: {
    emptyOutDir: true,
    outDir: "build",
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    https: httpsConfig, // Apply the HTTPS configuration conditionally
    proxy: {
      "/api": {
        target: "http://tol-portal-api:80",
        secure: false,
        changeOrigin: true,
        ws: true,
      },
    },
  },
});