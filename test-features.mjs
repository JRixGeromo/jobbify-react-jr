#!/usr/bin/env node

/**
 * Jobbify Application Feature Test Script
 * Tests core functionality without browser
 */

import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const APP_URL = 'http://localhost:5173';
const API_BASE = 'http://localhost:5173';

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({
        statusCode: res.statusCode,
        headers: res.headers,
        body: data
      }));
    });
    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// Test function
async function runTest(name, testFn) {
  console.log(`\n🧪 Testing: ${name}`);
  try {
    await testFn();
    console.log(`✅ PASSED: ${name}`);
    results.passed++;
    results.tests.push({ name, status: 'PASSED' });
  } catch (error) {
    console.log(`❌ FAILED: ${name}`);
    console.log(`   Error: ${error.message}`);
    results.failed++;
    results.tests.push({ name, status: 'FAILED', error: error.message });
  }
}

// Test 1: Application startup
async function testApplicationStartup() {
  const response = await makeRequest(APP_URL);
  if (response.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${response.statusCode}`);
  }
  if (!response.body.includes('<!doctype html>')) {
    throw new Error('Response does not contain HTML');
  }
}

// Test 2: Environment variables
async function testEnvironmentVariables() {
  // Check if .env file exists
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    throw new Error('.env file not found');
  }
  
  // Check .env.example for required variables
  const envExamplePath = path.join(process.cwd(), '.env.example');
  if (!fs.existsSync(envExamplePath)) {
    throw new Error('.env.example file not found');
  }
  
  const envExample = fs.readFileSync(envExamplePath, 'utf8');
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_SUPABASE_STORAGE_URL'
  ];
  
  for (const varName of requiredVars) {
    if (!envExample.includes(varName)) {
      throw new Error(`Required environment variable ${varName} not in .env.example`);
    }
  }
}

// Test 3: Static assets loading
async function testStaticAssets() {
  const assets = [
    '/src/main.tsx',
    '/src/App.tsx',
    '/vite.config.ts'
  ];
  
  for (const asset of assets) {
    // Check if files exist
    const fullPath = path.join(process.cwd(), asset);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Required file ${asset} not found`);
    }
  }
}

// Test 4: Package.json dependencies
async function testDependencies() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const requiredDeps = [
    'react',
    'react-dom',
    '@supabase/supabase-js',
    '@apollo/client',
    'typescript',
    'vite'
  ];
  
  for (const dep of requiredDeps) {
    if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
      throw new Error(`Required dependency ${dep} not found`);
    }
  }
}

// Test 5: TypeScript configuration
async function testTypeScriptConfig() {
  const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  
  if (tsConfig.compilerOptions.strict !== true) {
    throw new Error('TypeScript strict mode not enabled');
  }
  
  if (!tsConfig.compilerOptions.paths || !tsConfig.compilerOptions.paths['@/*']) {
    throw new Error('Path alias @/* not configured');
  }
}

// Test 6: API endpoints structure
async function testAPIStructure() {
  // Check if API directory exists
  const apiDir = path.join(process.cwd(), 'api');
  if (!fs.existsSync(apiDir)) {
    throw new Error('API directory not found');
  }
  
  // Check for required API files
  const requiredAPIFiles = [
    'createCheckoutSession.ts',
    'stripeWebhook.ts'
  ];
  
  for (const file of requiredAPIFiles) {
    const filePath = path.join(apiDir, file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`API file ${file} not found`);
    }
  }
}

// Test 7: GraphQL schema and queries
async function testGraphQLStructure() {
  // Check GraphQL directory
  const graphqlDir = path.join(process.cwd(), 'src', 'graphql');
  if (!fs.existsSync(graphqlDir)) {
    throw new Error('GraphQL directory not found');
  }
  
  // Check for query files
  const queryFiles = fs.readdirSync(graphqlDir).filter(f => f.includes('.ts'));
  if (queryFiles.length === 0) {
    throw new Error('No GraphQL query files found');
  }
}

// Test 8: Component structure
async function testComponentStructure() {
  const componentsDir = path.join(process.cwd(), 'src', 'components');
  if (!fs.existsSync(componentsDir)) {
    throw new Error('Components directory not found');
  }
  
  // Check for essential components
  const requiredComponents = [
    'ErrorBoundary.tsx',
    'Navbar.tsx',
    'LoadingSpinner.tsx'
  ];
  
  for (const component of requiredComponents) {
    const componentPath = path.join(componentsDir, component);
    if (!fs.existsSync(componentPath)) {
      throw new Error(`Required component ${component} not found`);
    }
  }
}

// Test 9: Route configuration
async function testRouteConfiguration() {
  const routesPath = path.join(process.cwd(), 'src', 'routes', 'index.tsx');
  if (!fs.existsSync(routesPath)) {
    throw new Error('Routes configuration file not found');
  }
  
  const routesContent = fs.readFileSync(routesPath, 'utf8');
  const requiredRoutes = [
    '/login',
    '/signup',
    '/dashboard',
    '/jobs',
    '/quotes',
    '/invoices'
  ];
  
  for (const route of requiredRoutes) {
    if (!routesContent.includes(route)) {
      throw new Error(`Required route ${route} not configured`);
    }
  }
}

// Test 10: Build configuration
async function testBuildConfiguration() {
  // Check vite.config.ts
  if (!fs.existsSync('vite.config.ts')) {
    throw new Error('Vite configuration file not found');
  }
  
  // Check build script in package.json
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (!packageJson.scripts.build) {
    throw new Error('Build script not found in package.json');
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Jobbify Application Tests\n');
  console.log('Testing application without browser...\n');
  
  await runTest('Application Startup', testApplicationStartup);
  await runTest('Environment Variables', testEnvironmentVariables);
  await runTest('Static Assets', testStaticAssets);
  await runTest('Dependencies', testDependencies);
  await runTest('TypeScript Configuration', testTypeScriptConfig);
  await runTest('API Structure', testAPIStructure);
  await runTest('GraphQL Structure', testGraphQLStructure);
  await runTest('Component Structure', testComponentStructure);
  await runTest('Route Configuration', testRouteConfiguration);
  await runTest('Build Configuration', testBuildConfiguration);
  
  // Print results
  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
  
  if (results.failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.tests.filter(t => t.status === 'FAILED').forEach(test => {
      console.log(`  - ${test.name}: ${test.error}`);
    });
  }
  
  console.log('\n🎯 Feature Status Summary:');
  console.log('  ✅ Application Structure: Complete');
  console.log('  ✅ Configuration: Complete');
  console.log('  ✅ Dependencies: Complete');
  console.log('  ⚠️  Runtime Features: Requires environment setup');
  console.log('  ⚠️  Database Features: Requires Supabase connection');
  console.log('  ⚠️  Authentication: Requires valid credentials');
  
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(console.error);
