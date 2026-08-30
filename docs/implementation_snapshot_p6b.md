# Phase 6B: Frontend Placement Integration Snapshot

## Goal
Implement the frontend "Will it fit? (AI)" feature based strictly on the approved Phase 6B audit. The integration securely routes user images and product IDs to the AI pipeline and returns placement feasibility results directly to the Product Details view without modifying backend implementations or inventing dimensions.

## Status: Implemented

## Files Created/Modified
### Created
- `apps/web/src/features/ai/types/placement.types.ts`: Strict types for `PlacementEvaluationResult`.
- `apps/web/src/features/ai/services/placement.service.ts`: Axios client handling `multipart/form-data` uploads.
- `apps/web/src/features/ai/hooks/use-placement.ts`: React Query mutation hook for API requests.
- `apps/web/src/features/ai/components/ai-placement-panel.tsx`: The primary "Will it fit?" UI handling idle, loading, success, and unsuitable states.

### Modified
- `apps/web/src/features/products/components/product-details-view.tsx`: Added a third `placement` segment to the view toggle, successfully rendering the `AiPlacementPanel` in the image gallery area when selected.

## Frontend Flow
1. **Product Details**: User clicks "Will it fit? (AI)" in the view toggle.
2. **AiPlacementPanel**: User uploads an image of their room. 
3. **POST /api/ai/placement**: Frontend sends `FormData` (image + `productId`) to Express.
4. **Proxy**: Express bridges to FastAPI.
5. **AI Evaluation**: YOLO, MiDaS, SpatialAnalysisEngine, and PlacementEvaluationEngine execute heuristics using 1x1x1 normalized dimensions.
6. **Frontend Scorecard**: Returns `suitable`, `evaluation_confidence`, `limiting_factor`, and `warnings`.

## API Contract
```typescript
export interface PlacementEvaluationResult {
  suitable: boolean;
  evaluation_confidence: number; // Formatted as "Heuristic Confidence: XX%"
  warnings: string[];
  limiting_factor: string | null;
  estimated_clearance: Record<string, number> | null;
  evaluated_orientation: string | null;
  evaluation_metadata: Record<string, unknown>;
}
```

## UI States Handled
- **Idle**: Dotted upload box requesting room image.
- **Image selected**: Displays preview thumbnail and an "Analyze Fit" button.
- **Analyzing**: Semi-transparent overlay with a pulsing scanning animation.
- **Suitable**: Green banner indicating a potential fit.
- **Unsuitable**: Red banner surfacing the `limiting_factor`.
- **Warnings / Limitations Disclosure**: Extracted the `DIMENSIONS_UNAVAILABLE` warning. This explicitly disclaims metric accuracy, framing the result as a relative heuristic visual estimation of space.

## Validation Results
- **Lint**: Fixed minor typing issues (`any` -> `unknown`, unused vars). Passed cleanly.
- **Build**: Successfully compiles.
- **UX**: All Product Details interactions (photos, 3D, and the new placement mode) function harmoniously.
