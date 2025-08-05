import NavBar from "../NavBar";
import Footer from "../Footer";
import { Box } from "@mui/material";

const BaseLayout = ({ children, headerImage }) => {
   return (
      <Box display="flex" flexDirection="column" minHeight="100vh">
         <Box
            sx={{
               maxWidth: 1200,
               width: "100%",
               mx: "auto",
            }}
         >
            {headerImage && (
               <Box
                  component="img"
                  src={headerImage}
                  alt="Page Header"
                  sx={{
                     width: "100%",
                     aspectRatio: "24 / 9",
                     objectFit: "fill",
                     borderRadiusBottom: 2,
                     display: "block",
                     mb: -3,
                  }}
               />
            )}

            <Box
               sx={{
                  backgroundColor: "#fbd688",
                  borderRadius: 5,
                  boxShadow: 2,
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "100%",
               }}
            >
               <NavBar />
               <Box flexGrow={1}>{children}</Box>
               <Footer />
            </Box>
         </Box>
      </Box>
   );
};

export default BaseLayout;