import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function GET(req, res) {

    let resObj = {
        success: true,
        message: 'Unknown response',
        data: null
    };
    try {

        const searchParams = req.nextUrl.searchParams;
        const paths = searchParams.get('paths');
        console.log('paths: ', paths);

        if (paths && paths.length > 0) {
            // Support comma-separated paths
            const pathArr = paths.split(',').map(p => p.trim()).filter(Boolean);
            console.log('pathArr: ', pathArr);

            for (const path of pathArr) {
                if (['home', 'root', '/', ''].includes(path.toLowerCase())) {
                    revalidatePath('/');
                } else {
                    revalidatePath(path);
                }
            }
            resObj.success = true;
            resObj.message = `Revalidated ${pathArr.length} paths successfully`;
        } else {
            resObj.success = false;
            resObj.message = 'No path provided for revalidation';
        }

        return NextResponse.json(resObj);
    } catch (error) {
        console.error('Error in revalidate API: ', error);
        resObj.success = false;
        resObj.message = 'Error in revalidate API';
        return NextResponse.json(resObj);
    }
}