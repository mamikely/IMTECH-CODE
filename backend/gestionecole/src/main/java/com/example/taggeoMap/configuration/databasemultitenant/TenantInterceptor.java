package com.example.taggeoMap.configuration.databasemultitenant;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;

public class TenantInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        // Récupérer le tenantId depuis un header (ex: "X-TenantID")
        String tenantId = request.getHeader("X-TenantID");
        System.out.println(tenantId);
        if (tenantId != null) {
            MultiTenantDataSource.setCurrentTenant(tenantId);
            System.out.println("✅ Tenant défini dans le contexte: " + MultiTenantDataSource.getCurrentTenant());
        }
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
            throws Exception {
        // Nettoyer le ThreadLocal après la requête
        MultiTenantDataSource.clear();
    }
}
