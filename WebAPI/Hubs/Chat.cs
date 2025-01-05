using Microsoft.AspNetCore.SignalR;
namespace WebAPI.Hubs
{
    public class Chat : Hub
    {
        // Send a message to a specific group
        public async Task Send(string groupName, string name, string message, string time)
        {
            await Clients.Group(groupName).SendAsync("addNewMessageToPage", name, message, time, groupName);
        }

        // Join a specific group
        public async Task JoinGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }

        // Leave a specific group
        public async Task LeaveGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }
    }
}
