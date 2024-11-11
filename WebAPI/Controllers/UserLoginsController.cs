using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]  // Route template for the controller
    [ApiController]   //Marks this as an API controller
    public class UserLoginsController : ControllerBase //controller class that inherits from ControllerBase, which is commonly used for Web APIs.
    {
        private readonly UserLoginDbContext _context; //Declares a read-only _context variable to interact with the database.

        public UserLoginsController(UserLoginDbContext context)  //Receives an instance of UserLoginDbContext, a database context, through dependency injection. This is used to perform database operations.
        { 
            _context = context;
        }


        // POST: api/UserLogins  <--New User-->
        [HttpPost]
        public async Task<IActionResult> PostUserLogin(UserLogin userLogin)
        {

            // Check if the ModelState is valid
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _context.UserLoginApi.Add(userLogin);
                await _context.SaveChangesAsync();
                return Ok("NewUser created successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error creating user : {ex.Message}");
            }
        }


        //Login  <--UserLogin-->  <--AdminLogin-->
        [HttpPost("Login")]
        public async Task<IActionResult> VerifyEmailAndPhone([FromBody]  VerificationResponse res)
        {
            
            // Search for the member by email
            var member = await _context.UserLoginApi.FirstOrDefaultAsync(m => m.Email == res.Email);

            var member1 = await _context.AdminLogin.FirstOrDefaultAsync(m => m.Email == res.Email);


            // Check if the member exists
            if (member != null)
            {
                bool isMatch = member.Password == res.Password;

                if (isMatch)
                {
                    return Ok("User");
                }
                return NotFound("Email and Password do not match.");
            }
            else if(member1 != null) 
            {
                bool isMatch = member1.Password == res.Password;

                if (isMatch)
                {
                    return Ok("Admin");
                }
                return NotFound("Email and Password do not match.");
            }
            else
            {
                return NotFound("Email not found");
            }
        }




        [HttpPost("EmailCheck")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerificationResponse res)
        {
            // Check if the ModelState is valid
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Search for the member by email
            var member = await _context.UserLoginApi.FirstOrDefaultAsync(m => m.Email == res.Email);

            // Check if the member exists
            if (member == null)
            {
                return NotFound("Email not found");
            }
            else
            {
                return Ok("Success");
            }


            //// Check if the phone number matches
            //bool isMatch = member.Password == res.Password;

            //if (isMatch)
            //{
            //    return Ok("Email and Password match.");
            //}
            //else
            //{
            //    return NotFound("Email and Password do not match.");
            //}

        }



        [HttpPost("UpdatePsd")]
        public async Task<IActionResult> PutMember([FromBody] PasswordUpdate member)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            // Search for the member by email
            var member1 = await _context.UserLoginApi.FirstOrDefaultAsync(m => m.Email == member.Email);

            // Check if the member exists
            if (member1 == null)
            {
                return NotFound("Email not found");
            }
            else
            {
                member1.Password = member.Password;
                member1.ConfirmPassword = member.ConfirmPassword;
                _context.Entry(member1).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok("Password Updated");
            }
        }



        [HttpPost("RetriveUserName")]
        public async Task<IActionResult> RetriveUserName([FromBody] VerificationResponse res)
        {
            // Check if the ModelState is valid
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Search for the member by email
            var member = await _context.UserLoginApi.FirstOrDefaultAsync(m => m.Email == res.Email);


            var username = member.UserName;

            // Check if the member exists
            if (member == null)
            {
                return NotFound("Email not found");
            }
            else
            {
                return Ok(username);
            }

        }
    }
}
