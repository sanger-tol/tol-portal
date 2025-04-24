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

export default defineConfig({
  plugins: [react(), viteTsconfigPaths()],
  resolve: {
    alias: {
      '@tol/tol-ui': path.resolve(__dirname, 'src/tol-ui/src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        importer: [
          (url: string) => {
            if (url.startsWith('~@tol/tol-ui')) {
              console.log('BANANA')
              console.log({ file: path.resolve(__dirname, 'src/tol-ui/src', url.replace('~@tol/tol-ui/', '')) })
              return { file: path.resolve(__dirname, 'src/tol-ui/src', url.replace('~@tol/tol-ui/', '')) };
            }
            return null;
          }
        ],
        includePaths: [
          path.resolve(__dirname, 'scss')
        ]
      }
    }
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
})
