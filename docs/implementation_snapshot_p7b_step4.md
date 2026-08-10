# Phase 7B Step 4: Frontend "Shop the Look" Integration

## Goal
Implement a polished Next.js React frontend to consume the Express Gateway visual recommendation proxy, offering users a "Shop This Room" capability.

## Architecture
The Next.js client continues to be strictly decoupled from the internal Python/FastAPI environment. It communicates exclusively with `POST /api/ai/visual-recommend` through Axios.

### Request Flow
1. User clicks **"✨ Shop This Room"** button on the `products/page.tsx` view.
2. The `VisualRecommendPanel` appears, presenting an upload state.
3. User selects a room image.
4. User clicks **Analyze Room**.
5. The `useVisualRecommend` React Query mutation fires a multipart upload via Axios.
6. The panel switches to a `ScanLine` loading overlay while waiting for the AI subsystem.
7. Upon success, the panel renders the `visual_context` block detailing what YOLO detected, and maps the `recommended_product_ids` array into a visually pleasing grid of `ProductCard` components using the existing `ProductSummary` dataset.

## Component Implementation

### 1. Types & Service & Hook
- `apps/web/src/features/ai/types/visual-recommendation.types.ts`: Strictly matches the backend payload containing `visual_context` and `matching_info`.
- `apps/web/src/features/ai/services/visual-recommendation.service.ts`: Handles the multipart `FormData` generation and Axios upload.
- `apps/web/src/features/ai/hooks/use-visual-recommend.ts`: Exposes the `useMutation` React Query hook with exposed `reset` capability.

### 2. Panel Component
- `apps/web/src/features/ai/components/visual-recommend-panel.tsx`: A self-contained, heavily styled panel encompassing the complete feature lifecycle.
- **Idle State**: Dotted dropzone area for file selection.
- **Ready State**: Image preview with a description and the prominent "Analyze Room" button.
- **Scanning State**: Overlay with pulsing animation.
- **Results State**: Dynamic readout indicating the detected class (e.g. `🛋️ We detected: couch`) and the `ProductGrid` of matches.

### 3. Page Integration
- `apps/web/src/app/products/page.tsx`: Added a dedicated toggle button beside the standard AI Recommendations button. Uses shared logic to close mutually exclusive panels (e.g. opening "Shop This Room" closes "AI Recommendations").
- Injects the `allProducts` dataset into the panel so IDs can be successfully hydrated into rich product cards.

## Error Handling
- The panel gracefully rejects non-image formats.
- If Axios throws an error (e.g., 504 Gateway Timeout or 503 Unavailable), the panel displays a styled error alert box gracefully without crashing the page.

## Testing & Verification
The Next.js build (`npm run build` & `npm run lint`) passed successfully after removing an unused skeleton import and typing the generic `Record` correctly.

The UI avoids all misleading AR or spatial claims, maintaining the specific tone required: *"What furniture complements my existing room?"*

## Deviations & Risks
- **No Deviations**: Successfully reused all visual language components (ProductCard) and fetching patterns.
- **Risks**: The client relies on finding `ProductSummary` matches within the `data` array loaded on the current page. Since the backend retrieves all seed data and passes it through `getProducts`, the IDs match up properly.

## Status
**READY**: Phase 7B Step 4 is complete. The system is ready for the final Phase 7B Step 5 (End-to-End Verification).
