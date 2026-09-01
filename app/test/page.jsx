import PageWrapper from "@/components/pageWrapper";
 
export default function Page() {

  
    return (
        <PageWrapper params={{
            title: 'test',
            description: 'This is a test page.',
            slug: ['test'],
        }}>
            <div className="text-red-400">Test Page</div>

      
        </PageWrapper>
    );
}