﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly UserLoginDbContext _context;
        public AdminController(UserLoginDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<WorkUpdate>>> GetMembers()
        {
            var member = await _context.WorkUpdate.ToListAsync();
            return Ok(member);
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

            string username = "";

            // Check if the member exists
            if (member != null)
            {
                username = member.UserName;
            }
            return Ok(username);

        }


        [HttpGet("ListOfUserNames")]
        public async Task<ActionResult<IEnumerable<string>>> ListOfUserNames()
        {
            var uniqueUsernames = await _context.UserLoginApi.Select(w => new { w.Email, w.UserName }).ToListAsync();

            if(uniqueUsernames == null)
            {
                return Ok();
            }

            return Ok(uniqueUsernames);
        }


        [HttpPost("RetriveEmailthroughUserName")]
        public async Task<IActionResult> RetriveEmailthroughUserName([FromBody] VerificationResponse res)
        {
            // Check if the ModelState is valid
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Search for the member by email
            var member = await _context.UserLoginApi.FirstOrDefaultAsync(m => m.Email == res.UserName);


            var email = member.Email;

            // Check if the member exists
            if (member == null)
            {
                return NotFound("Email not found");
            }
            else
            {
                return Ok(email);
            }

        }


        [HttpPost("updateResponseMessage")]
        public IActionResult updateResponseMessage(WorkUpdate wrk)
        {
            //var member = _context.WorkUpdate.FirstOrDefault(x => x.Id == wrk.Id);
            _context.WorkUpdate.Update(wrk);
            _context.SaveChanges();
            return Ok();
        }


        [HttpPost("Save_the_GroupDetails")]
        public IActionResult Save_the_GroupDetails(GroupDetails grp)
        {
            _context.GroupDetails.Add(grp);
            _context.SaveChangesAsync();
            return Ok();
        }


        [HttpGet("GetExistingGroupName")]
        public IActionResult GetExistingGroupName()
        {
            var member = _context.GroupDetails.Select(t => new
            {
                t.GroupName,
                t.Description
            });

            return Ok(member);
        }


        [HttpPost("Add_NewMember_In_ExistingGroup")]
        public IActionResult Add_NewMember_In_ExistingGroup(GroupDetails grp)
        {
            var resp = "";
                var group = _context.GroupDetails.FirstOrDefault(x => x.GroupName == grp.GroupName);

                if (group != null && grp.UserName != null)
                {
                    group.UserName.AddRange(grp.UserName);
                    _context.SaveChanges();
                    resp = "New Member Added";

                }
                
            return Ok(resp);
        }


        [HttpPost("Remove_ExistingMember_in_the_Group")]
        public IActionResult Remove_ExistingMember_in_the_Group(GroupDetails grp)
        {
            var resp = "";
            var group = _context.GroupDetails.FirstOrDefault(x => x.GroupName == grp.GroupName);

            if (group != null && grp.UserName != null && grp.UserName.Any())
            {
                foreach (var user in grp.UserName)
                {
                    group.UserName.Remove(user);
                }

                _context.SaveChanges();
                resp = "Members Removed Successfully";
            }
            else
            {
                resp = "Group or UserName(s) not found";
            }

            return Ok(resp);
        }


        [HttpGet("Retrive_UserName_Role")]
        public async Task<ActionResult<IEnumerable<string>>> Retrive_UserName_Role()
        {
            var Member = await _context.UserLoginApi.Select(w => new { w.UserName, w.Role, w.Joining_Date }).ToListAsync();

            if (Member == null)
            {
                return Ok();
            }

            return Ok(Member);
        }



        [HttpPost("updateRole_Database")]
        public IActionResult updateRole_Database([FromBody] VerificationResponse res)
        {
            var user = _context.UserLoginApi.SingleOrDefault(u => u.UserName == res.UserName);
            var resp = "Failed";
            if (user != null)
            {
                user.Role = res.Role;
                _context.SaveChanges();
                resp = "";
            }


            return Ok(resp);
        }
    }
}
 
                                                                                                          
 
   