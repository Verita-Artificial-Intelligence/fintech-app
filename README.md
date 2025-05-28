# Royal Business Bank Financial Application

A comprehensive financial technology platform with three main modules:

1. **Unified FBO-Ledger Monitoring**
   - Real-time visibility on every sub-account
   - Automated BSA/AML rules & one-click SAR/CTR reports
   - Row-level encryption + full audit trails

2. **Fraud-Detection & Compliance Toolkit**
   - Live card-fraud alerts and threat-simulation "red team" testing
   - Continuous PCI/GDPR/SOC 2 evidence packs
   - KPI dashboard for fraud rate, MTTR, and open gaps

3. **Automated Underwriting Engine**
   - OCR/LLM pipeline that scores W-2s, bank statements, FICO, DSCR, etc.
   - 0-100 eligibility score with an explain-why panel
   - Human-in-the-loop override; feedback retrains the model

## Quick Start

To run the Royal Business Bank platform, we provide multiple options depending on your needs:

### Option 1: Run the HTML Version (Guaranteed to Work)

This is the simplest option and requires no dependencies:

```bash
cd fintech-app/fintech-app
./serve-app.sh
```

The application will automatically open in your browser at:
http://localhost:3006/simplified-app.html

### Option 2: Run the Full React Application

For the complete React application with all features:

```bash
cd fintech-app/fintech-app
./start-app.sh
```

The application will be available at:
http://localhost:3006

## Color Scheme

The Royal Business Bank website employs a clean and professional color scheme centered around shades of blue, complemented by white and gray accents. This palette aligns with the bank's emphasis on trust, stability, and clarity.

### Primary Colors
- **Royal Blue:** A deep, vivid blue (#002366) that serves as the dominant color throughout the site. This hue is commonly associated with professionalism and reliability in the financial industry.
- **White:** Used extensively for backgrounds and text areas, providing a clean and uncluttered appearance that enhances readability.
- **Gray:** Utilized for secondary elements such as navigation menus and footers, offering a neutral contrast to the primary blue.

### Color Palette Summary
| Color Name  | Hex Code | Usage |
|-------------|----------|-------|
| Royal Blue  | #002366  | Primary branding, headers, buttons |
| White       | #FFFFFF  | Backgrounds, text areas |
| Gray        | #808080  | Navigation, footers, secondary text |

This color scheme reflects Royal Business Bank's commitment to professionalism and community focus.

## Features

- Interactive dashboards for each module
- Real-time monitoring and alerts
- Responsive design for all device sizes
- Rich data visualization
- Comprehensive financial tools
- Secure authentication and user management

## Troubleshooting

If you encounter any issues:

1. Make sure port 3006 is not already in use
2. Try the HTML version first to confirm your environment is working
3. Check for any console errors in your browser's developer tools

## Project Structure

- `/src/components/` - Reusable UI components
- `/src/pages/` - Main application pages
- `/src/api/` - API service interfaces
- `/src/utils/` - Utility functions
- `/src/hooks/` - Custom React hooks
## Machine Learning Fraud Detection

A sample Python script demonstrates how to train a simple logistic regression model for fraud detection using synthetic data. The script saves a model file named `fraud_model.pkl` in the project root.

Run the training script:

```bash
python3 scripts/fraud_detection_model.py
```

You will see classification metrics and the resulting model file.

