package at.htlleonding.boundary;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

@Path("/budget")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BudgetResource {

    private double goal = 12000.0;
    private double income = 0.0;
    private double expenses = 0.0;

    @GET
    @Path("/goal")
    public double getGoal() {
        return goal;
    }

    @POST
    @Path("/goal")
    public void setGoal(double newGoal) {
        this.goal = newGoal;
    }

    @GET
    @Path("/income")
    public double getIncome() {
        return income;
    }

    @POST
    @Path("/income")
    public void addIncome(double amount) {
        this.income += amount;
    }

    @GET
    @Path("/expenses")
    public double getExpenses() {
        return expenses;
    }

    @POST
    @Path("/expenses")
    public void addExpense(double amount) {
        this.expenses += amount;
    }

    @GET
    @Path("/profit")
    public double getProfit() {
        return income - expenses;
    }
}