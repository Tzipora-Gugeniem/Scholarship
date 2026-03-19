import { Link, NavLink } from 'react-router'
import '../css/home.css'


import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  Container,
  Avatar,
  Divider,
} from "@mui/material";

export const Home = () => {
  //מערך סטודנטים מצליחים
  // יוצג בתחתית הדף עם תמונה
  const students = [{ name: "Sigal Saily", description: "This was the opportunity of my life. I developed, I progressed, and I came far.", }, 
  { name: "Nehoray Arieli", description: "Sometimes all a student needs is something to support them. Thank you.", }, 
  { name: "Rolli teth", description: "I can say that this scholarship is what brought me to prosperity and economic prosperity.", },
{ name: "tal Gotlib", description: "The scholarship I received was my starting point. I started investing and persevering, and that's why I saw results....", }];


  
  return <>


    <Box sx={{ bgcolor: "#f7f7f7" }}>
      <div style={{ height: '20vh', position: 'fixed' }}></div>
      <section class="hero">
        <div class="hero-content">
          <h1>Apply for the Future Scholarship!</h1>
          <p>Support your educational dream. Applications are now open for outstanding students.</p>
          {/* <NavLink  to="Apply">Apply Now</NavLink> */}
        </div>

        <div class="hero-image">
          <img src="./students/student.jpg" alt="Students" />
        </div>
      </section>

      {/* HERO SECTION */}
      <Box
        sx={{
          bgcolor: "#3a4651ff",
          color: "white",
          py: 10,
          textAlign: "center",
        }}
 >
        <Typography variant="h2" fontWeight="bold" mb={2}>
          National Scholarship Portal
        </Typography>

{/* אנימציות */}
        <Box sx={{ display: "flex", justifyContent: "center", mx: "auto" }}>

          <section class="info-section">
            <h2>Why Apply?</h2>

            <div class="info-cards">

              <div class="card">
                <img src="./תשלום.gif" />
                <h3>Financial Support</h3>
                <p>Receive funding assistance for your studies and daily student life.</p>
              </div>

              <div class="card">
                <img src="./study.gif" />
                <h3>Professional Support</h3>
                <p>Workshops and training programs for personal and professional growth.</p>
              </div>

              <div class="card">
                <img src="./conect2.gif" />
                <h3>Networking</h3>
                <p>An opportunity to meet other students and top mentors.</p>
              </div>

            </div>
          </section>



        </Box>
      </Box>

      
       
        <Container sx={{ py: 8 }}>
     
      

        

          {/* TESTIMONIALS */}
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            mt={12}
            sx={{ color: "#009FAF" }}
          >
            Student Success Stories
          </Typography>

          <Grid container spacing={4} mt={4} sx={ {justifyContent:'center'}}>
            {students.map((t) => (
             <Box key={t} sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" ,width:"40%" ,flexDirection:"row" ,p:2 }}>
                <Card sx={{ borderRadius: 4, p: 3, boxShadow: 3 , minHeight: "20vh"}}>
                  <CardContent>
                    <Avatar
                 src={`/students/${t.name}.jpg`} 
                      sx={{
                        width: 60,
                        height: 60,
                        mb: 2,
                 
    backgroundSize: "cover",
    backgroundPosition: "center",
                      }}
                    >
                     
                       {/* <PersonIcon sx={{ fontSize: 40 }} />   */}
                     
                    </Avatar>
                    <Typography fontWeight="bold">
                      {t.description}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                     {`- ${t.name}`}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Grid>
        

    {/* תחתית הדף -יוצר והגדרות... */}
          <Box
            sx={{
              mt: 12,
              py: 6,
              textAlign: "center",
              bgcolor: "#009FAF",
              color: "white",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              National Scholarship Portal
            </Typography>
            <Typography sx={{ opacity: 0.9, mt: 1 }}>
              Empowering Students ● Shaping Futures
            </Typography>
            <Divider sx={{ bgcolor: "white", my: 3, opacity: 0.4 }} />
            <Typography sx={{ opacity: 0.7 }}>© 2025 All Rights Reserved</Typography>
          </Box>
        </Container>
      </Box>

   

 </>
}

