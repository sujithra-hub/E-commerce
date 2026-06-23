package com.example.demo.controller;
import org.springframework.web.bind.annotation.*;
import com.example.demo.service.PaymentService;
@RestController
@RequestMapping("/api/payment")
@CrossOrigin
public class PaymentController {
    
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public String createOrder(@RequestParam int amount) throws Exception {
        System.out.println("API HIT");
        return paymentService.createOrder(amount);
    }
}