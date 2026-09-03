import { NextResponse } from "next/server";
import { directusRequest } from "@/services/directus";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const query = (searchParams.get('query') || '').trim();
        const offset = Math.max(0, Number.parseInt(searchParams.get('offset') || '0', 10) || 0);
        const limit = Math.min(50, Math.max(1, Number.parseInt(searchParams.get('limit') || '20', 10) || 20));

        const params = {
            limit,
            offset,
            sort: '-date_created',
        };

        if (query) {
            params.filter = {
                _or: [
                    { rca_zone_name: { _contains: query } },
                    { legal_reference: { _contains: query } },
                ],
            };
        }

        const result = await directusRequest({
            method: 'GET',
            endpoint: '/items/speed_limits',
            params,
        });

        if (!result?.success) {
            return NextResponse.json(
                { success: false, message: result?.message || 'Failed to fetch speed limits', data: [] },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.data || [],
            meta: result.meta || null,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error?.message || 'Unexpected server error',
                data: [],
            },
            { status: 500 }
        );
    }
}
