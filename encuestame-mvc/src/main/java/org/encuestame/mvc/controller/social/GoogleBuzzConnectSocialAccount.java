package org.encuestame.mvc.controller.social;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.encuestame.core.config.EnMePlaceHolderConfigurer;
import org.encuestame.oauth2.support.OAuth2Parameters;
import org.encuestame.persistence.domain.social.SocialProvider;
import org.encuestame.utils.oauth.AccessGrant;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.context.request.WebRequest;

/**
 * Google Buzz Connect Social Account.
 * @author Picado, Juan juanATencuestame.org
 * @since 01/08/2011
 */
@Controller
public class GoogleBuzzConnectSocialAccount extends AbstractAccountConnect{


    /**
     * Log.
     */
    private Logger log = Logger.getLogger(this.getClass());

    /**
     *
     * @param appId
     * @param accessTokenUrl
     * @param authorizeUrl
     * @param clientSecret
     * @param clientId
     */
    @Inject
    public GoogleBuzzConnectSocialAccount(
            @Value("${google.api.key}") String keyId,
            @Value("${google.accesToken}") String accessTokenUrl,
            @Value("${google.authorizeURl}") String authorizeUrl,
            @Value("${google.client.secret}") String clientSecret,
            @Value("${google.client.id}") String clientId) {
       super(new OAuth2Parameters(clientId, clientSecret, accessTokenUrl,
                 authorizeUrl, SocialProvider.GOOGLE_BUZZ, clientId));
    }

    /**
     *
     * @return
     */
    @RequestMapping(value="/connect/google", method = RequestMethod.GET)
    public String signinGoogleGet(){
        return "redirect:/settings/social";
    }

    /**
     *
     * @param scope
     * @param httpRequest
     * @return
     */
    @RequestMapping(value = "/connect/google", method = RequestMethod.POST)
    public String connectGooglePost(
            @RequestParam(required = false) String scope,
            HttpServletRequest httpRequest) {
        return this.auth2RequestProvider.buildOAuth2AuthorizeUrl(
                EnMePlaceHolderConfigurer.getProperty("google.buzz.scope"), httpRequest, false);
    }

    /**
     *
     * @param code
     * @param httpRequest
     * @param request
     * @return
     * @throws Exception
     */
    @RequestMapping(value="/social/back/google", method=RequestMethod.GET, params="code")
    public String oauth2Callback(
            @RequestParam("code") String code,
            HttpServletRequest httpRequest,
        WebRequest request) throws Exception {
            final AccessGrant accessGrant = auth2RequestProvider.getAccessGrant(code, httpRequest);
            log.debug(accessGrant.getAccessToken());
            log.debug(accessGrant.getRefreshToken());
            checkOAuth2SocialAccount(SocialProvider.GOOGLE_BUZZ, accessGrant);
            return this.redirect+"#provider="+SocialProvider.GOOGLE_BUZZ.toString().toLowerCase()+"&refresh=true&successful=true";
    }
}